import logging
from typing import Any
from aiogram import Router, types, F
from aiogram.enums import ParseMode
from aiogram.filters import Command
from sqlalchemy.exc import SQLAlchemyError

from database.database_connect import session_factory
from database.models import BlocksOrm, ConsultationsOrm
from keyboards.inline_keyboard import block_start
from texts.text import errors

router = Router()


async def fetch_consultations(session: session_factory, chat_id: int) -> int | str | dict[int, list[Any]]:
    """Функція для отримання консультацій на основі chat_id."""
    consultations_by_day = {i: [] for i in range(1, 8)}  # Дні тижня від 1 до 7

    blocks = session.query(BlocksOrm).filter(BlocksOrm.ChatsId.contains(str(chat_id))).all()
    if not blocks:
        consultations_by_day = 0
        return consultations_by_day

    for block in blocks:
        # Отримуємо всі консультації
        consultations = session.query(ConsultationsOrm).filter(
            ConsultationsOrm.BlockId == block.Id
        ).all()

        if not consultations:
            consultations_by_day = ""
            return consultations_by_day

        for day in consultations_by_day:
            day_consultations = [c for c in consultations if c.Day == day]
            consultations_by_day[day].extend(day_consultations)

    return consultations_by_day


async def format_consultations(consultations_by_day: dict) -> str:
    """Функція для форматування консультацій."""
    result = "<b>Консультації</b>:\n\n"

    days_of_week = ["<b>Понеділок</b>", "<b>Вівторок</b>", "<b>Середа</b>", "<b>Четвер</b>", "<b>П'ятниця</b>",
                    "<b>Субота</b>", "<b>Неділя</b>"]

    for day_number, day_name in enumerate(days_of_week, start=1):
        day_consultations = consultations_by_day.get(day_number, [])
        if not day_consultations:
            continue  # Пропустити дні без консультацій

        result += f"{day_name}\n"

        for consultation in day_consultations:
            time_start = consultation.TimeStart
            lesson_details = f'<a href="{consultation.Link}"><b>{consultation.Title}</b></a>' if consultation.Link else f"<b>{consultation.Title}</b>"
            teacher_name = f", {consultation.TeacherName}" if consultation.TeacherName else ""
            cabinet = f"– Кабінет: <i>{consultation.Cabinet}</i>" if consultation.Cabinet else ""
            result += f"<i>{time_start.strftime('%H:%M')}</i> – {lesson_details} {teacher_name} {cabinet}\n"

        result += "\n"

    return result.strip()


@router.message(Command("consultations"))
@router.message(F.text.lower() == "консультації")
async def get_consultations(message: types.Message):
    """Функція для відправлення консультацій за chat_id."""
    chat_id = message.chat.id
    session = session_factory()
    try:
        consultations_by_day = await fetch_consultations(session, chat_id)
        if consultations_by_day == 0:
            await message.answer(text=errors["block_was_deleted"])
            logging.info(f"ПОМИЛКА {message.from_user.username}: користувач видалив блок")
        elif consultations_by_day:
            formatted_consultations = await format_consultations(consultations_by_day)
            await message.answer(formatted_consultations, parse_mode=ParseMode.HTML, disable_web_page_preview=True)
        else:
            await message.answer(text=errors["not_consultations"], reply_markup=block_start())
    except SQLAlchemyError as e:
        await message.answer(text=errors["DBErrors"])
        logging.info(f"ПОМИЛКА {message.from_user.username}: помилка бази даних, {e}")
    finally:
        session.close()
