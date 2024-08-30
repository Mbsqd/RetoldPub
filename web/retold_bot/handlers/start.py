import logging

from aiogram import Bot, Router, types, F
from aiogram.filters import Command
from aiogram.types import CallbackQuery, ReplyKeyboardRemove
from aiogram.utils.keyboard import InlineKeyboardBuilder
from sqlalchemy.exc import SQLAlchemyError
from database.database_connect import session_factory
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from files.config_data import config
from database.models import UsersOrm, BlocksOrm
from keyboards.inline_keyboard import site_keyboard
from keyboards.main_keyboard import create_main_keyboard
from texts.text import errors, welcome_text

router = Router()
bot = Bot(token=config.bot_token)


class BotStates(StatesGroup):
    waiting_for_token = State()  # Очікування токена.
    waiting_for_block_selection = State()  # Очікування вибору блоку.


@router.message(Command("start"))
async def send_welcome(message: types.Message, state: FSMContext):
    """"Обробник команди /start."""
    chat_id = message.chat.id
    session = session_factory()
    try:
        # Знайти всі блоки, де поточний чат ID прив'язаний.
        blocks = session.query(BlocksOrm).filter(BlocksOrm.ChatsId.contains(str(chat_id))).all()

        for block in blocks:
            # Видалити чат ID із прив'язаних ID
            chat_ids = block.ChatsId.split()
            if str(chat_id) in chat_ids:
                chat_ids.remove(str(chat_id))
                block.ChatsId = ' '.join(chat_ids)
                session.commit()
                logging.info(
                    f"Користувач {message.from_user.username} видалив чат {message.chat.id} з блоку {block.Title}.")
        await message.answer(text=welcome_text, reply_markup=ReplyKeyboardRemove())
        await message.answer('Введіть свій токен, який отримали на сайті, за допомогою команди "/token Ваш токен":',
                             reply_markup=site_keyboard())
        await state.set_state(BotStates.waiting_for_token)  # Встановлення стану очікування токена.
    except SQLAlchemyError as e:
        logging.info(f"ПОМИЛКА {message.from_user.username}: помилка бази даних, {e}.")
        await message.answer(text=errors["DBError"])
    finally:
        session.close()
        await state.clear()  # Очищення стану.


@router.message(Command("token"))
@router.message(BotStates.waiting_for_token)
async def check_token(message: types.Message, state: FSMContext):
    """Функція перевірки наявності токена у БД та очікування вибору блоків, прив'язаних до токена."""

    token_list = message.text.split()

    if len(token_list) <= 1:
        await handle_invalid_token(message)
        return

    token = token_list[1]
    blocks = await get_blocks_by_token(token, message)

    await present_blocks_selection(message, blocks, state) if blocks else await handle_token_without_blocks(message, token)


async def present_blocks_selection(message: types.Message, blocks: list, state: FSMContext):
    """Функція для відображення блоків для вибору"""
    keyboard_builder = InlineKeyboardBuilder()
    for block in blocks:
        keyboard_builder.button(text=block.Title, callback_data=f"block_{block.Id}")
    keyboard = keyboard_builder.as_markup()

    await message.answer("Виберіть блок для прив'язки до чату:", reply_markup=keyboard)
    await state.set_state(BotStates.waiting_for_block_selection)


async def handle_chat_is_associated(message: types.Message):
    """Обробка ситуації, коли чат не прив'язаний до жодного блоку."""
    await message.answer(text=f"Чат вже прив'язаний до блоку.")
    logging.info(f"ПОМИЛКА {message.from_user.username}: Чат вже прив'язаний до блоку.")


async def handle_invalid_token(message: types.Message):
    """Функція для відображення блоків для вибору"""
    await message.answer(text=errors["not_token"])
    logging.info(f"ПОМИЛКА {message.from_user.username}: Токен не знайдений.")


async def handle_token_without_blocks(message: types.Message, token: str):
    """Функція для обробки токенів без блоків"""
    try:
        session = session_factory()
        user = session.query(UsersOrm).filter(UsersOrm.TelegramCode == token).first()
        await message.answer(text=errors["token_not_blocks"])
        logging.info(
            f"ПОМИЛКА {message.from_user.username}: Знайдений токен користувача {user}, але користувач не має блоків.")
    except SQLAlchemyError as e:
        await message.answer(text=errors["not_token"])
        logging.info(f"ПОМИЛКА {message.from_user.username}: Токен не знайдений, {e}.")


@router.callback_query(BotStates.waiting_for_block_selection, F.data.startswith("block_"))
async def process_block_selection(callback_query: CallbackQuery, state: FSMContext):
    """Функція прив'язки блоку до чату."""
    block_id = int(callback_query.data.split('_')[1])
    chat_id = callback_query.message.chat.id
    session = session_factory()

    try:
        block = session.query(BlocksOrm).filter(BlocksOrm.Id == block_id).first()
        if block:
            existing_chat_ids = block.ChatsId.split() if block.ChatsId else []
            if str(chat_id) not in existing_chat_ids:
                existing_chat_ids.append(str(chat_id))
                block.ChatsId = ' '.join(existing_chat_ids)
                session.commit()
            await callback_query.answer("Чат успішно прив'язаний!")
            await callback_query.message.delete()
            if callback_query.message.chat.type == "private":
                await callback_query.message.answer(f"Тепер поточний чат прив'язаний до блоку {block.Title}."
                                                    f"\nМожете використовувати команди надані вище, або через зручну клавіатуру нижче.",
                                                    reply_markup=create_main_keyboard())
            else:
                await callback_query.message.answer(f"Тепер поточний чат прив'язаний до блоку {block.Title}."
                                                    f"\nРекомендую оновити свій токен на сайті, якщо не хочете, щоби хтось користувався Вашим розкладом без Вашого відому."
                                                    f"\nМожете використовувати команди надані вище, або через меню знизу.",
                                                    reply_markup=create_main_keyboard())
            logging.info(f"Користувач успішно прив'язав чат {callback_query.message.chat.id} до блоку {block.Title}.")

        else:
            await callback_query.message.answer("Помилка: Блок не знайдений.")
    except SQLAlchemyError as e:
        print(f"ПОМИЛКА {types.Message.from_user.username}: помилка бази даних, {e}")
        session.rollback()
        await callback_query.message.answer(errors["DBError"])
    finally:
        session.close()
        await state.clear()  # Очищення стану.


async def get_blocks_by_token(token: str, message: types.Message) -> list | None:
    """Функція для перевірки токена у базі даних"""
    session = session_factory()
    try:
        user = session.query(UsersOrm).filter(UsersOrm.TelegramCode == token).first()
        if user:
            blocks = session.query(BlocksOrm).filter(BlocksOrm.UserId == user.Id).all()
            return blocks
        return None
    except SQLAlchemyError as e:
        print(f"ПОМИЛКА {message.from_user.username}: помилка бази даних, {e}")
        return None
    finally:
        session.close()
