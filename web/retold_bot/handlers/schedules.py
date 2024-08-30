import datetime
import logging
from typing import Any
from aiogram import Router, types, F
from aiogram.enums import ParseMode
from aiogram.filters import Command
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from database.database_connect import session_factory
from database.models import BlocksOrm, SchedulesOrm
from handlers.alerts import get_active_alerts
from keyboards.inline_keyboard import block_start
from texts.text import errors

router = Router()


async def get_current_week_type(week_type: bool) -> bool:
    """Функція для визначення типу поточного або наступного тижня."""
    current_date = datetime.date.today()  # Отримання поточної дати.
    week_number = current_date.isocalendar()[1]  # Отримання номера тижня в році.
    if week_type:
        return week_number % 2 != 0
    else:
        return week_number % 2 == 0


async def fetch_combined_schedules(session: Session, chat_id: int, week_type) -> int | str | dict[int, list[Any]]:
    """Функція для отримання комбінованого розкладу."""
    schedules_by_day = {i: [] for i in range(1, 8)}  # Дні тижня від 1 до 7.

    # Пошук блоку, який прив'язані до чату.
    blocks = session.query(BlocksOrm).filter(BlocksOrm.ChatsId.contains(str(chat_id))).all()
    if not blocks:
        # Якщо не знайдено блоку, користувач його видалив.
        schedules_by_day = 0
        return schedules_by_day

    # Завантаження інформації з блоку.
    for block in blocks:
        common_schedules = session.query(SchedulesOrm).filter(
            SchedulesOrm.BlockId == block.Id,
            SchedulesOrm.TypeWeek == 0  # Загальний
        ).all()

        # Отримуємо всі заняття для чисельника (0) і знаменника (1)
        numer_schedules = session.query(SchedulesOrm).filter(
            SchedulesOrm.BlockId == block.Id,
            SchedulesOrm.TypeWeek == 1  # Чисельник
        ).all()

        denom_schedules = session.query(SchedulesOrm).filter(
            SchedulesOrm.BlockId == block.Id,
            SchedulesOrm.TypeWeek == 2  # Знаменник
        ).all()

        # Якщо немає жодного запису, користувач не заповнив таблицу.
        if not common_schedules and not numer_schedules and not denom_schedules:
            schedules_by_day = ""
            return schedules_by_day

        # Розбивка розкладу на три типи, а також сортування за днем.
        for day in schedules_by_day:
            common_day_schedules = {s.TimeStart: s for s in common_schedules if s.Day == day}
            numer_day_schedules = {s.TimeStart: s for s in numer_schedules if s.Day == day}
            denom_day_schedules = {s.TimeStart: s for s in denom_schedules if s.Day == day}

            # Збір типів в один розклад за пріоритетом типу тижня.
            combined_schedules = {}

            # Якщо тиждень чисельник, пріоритет віддаємо заняттям чисельника.
            if week_type == 1:
                combined_schedules.update(numer_day_schedules)
                combined_schedules.update(common_day_schedules)
            else:
                combined_schedules.update(denom_day_schedules)
                combined_schedules.update(common_day_schedules)

            schedules_by_day[day].extend(combined_schedules.values())

    return schedules_by_day


async def format_schedules(schedules_by_day: dict, week_type: bool) -> str:
    """Функція для форматування комбінованого розкладу."""
    # Створення заголовка повідомлення.
    week_type_str = "Знаменник" if not week_type else "Чисельник"
    result = f"Тиждень: <b>{week_type_str}</b>.\n\n"

    # Список назва днів тижня.
    days_of_week = ["<b>Понеділок</b>", "<b>Вівторок</b>", "<b>Середа</b>", "<b>Четвер</b>", "<b>П'ятниця</b>",
                    "<b>Субота</b>", "<b>Неділя</b>"]
    # Сортування розкладу за днями. Створення розкладу зі всіма даними.
    for day_number, day_name in enumerate(days_of_week, start=1):
        day_schedules = schedules_by_day.get(day_number, [])
        if not day_schedules:
            continue  # Пропустити дні без занять

        result += f"{day_name}\n"

        schedule_dict = {}
        for schedule in day_schedules:
            time_start = schedule.TimeStart
            if time_start not in schedule_dict:
                lesson = f"{schedule.Title} "

                linkLecture = f'<i><a href="{schedule.LinkFirst}">{schedule.LessonType}</a></i>' if schedule.LinkFirst else ''
                linkPracticeBoth = f'<i><a href="{schedule.LinkFirst}">I</a> <a href="{schedule.LinkSecond}">II</a></i>' if schedule.LinkFirst and schedule.LinkSecond else ''
                linkPracticeOnlySecond = f'<i><a href="{schedule.LinkSecond}">{schedule.LessonType}</a></i>' if schedule.LinkSecond else ''

                if linkPracticeBoth:
                    schedule_dict[time_start] = f"{lesson} {linkPracticeBoth}"
                elif linkPracticeOnlySecond:
                    schedule_dict[time_start] = f"{lesson} {linkPracticeOnlySecond}"
                elif linkLecture:
                    schedule_dict[time_start] = f"{lesson} {linkLecture}"
                else:
                    schedule_dict[time_start] = f"{lesson} <i>{schedule.LessonType}</i>"

        sorted_times = sorted(schedule_dict.keys())
        for time in sorted_times:
            result += f"<i>{time.strftime('%H:%M')}</i> - {schedule_dict[time]}\n"
        result += "\n"

    return result.strip()


async def send_schedule(message: types.Message, next_week):
    """Функція для отримання комбінованого розкладу за чат ID для поточного типу тижня."""
    chat_id = message.chat.id
    session = session_factory()
    try:
        week_type = await get_current_week_type(next_week)
        schedules_by_day = await fetch_combined_schedules(session, chat_id, week_type)
        if schedules_by_day == 0:
            # Користувач видалив блок, до якого був прив'язаний чат.
            await message.answer(text=errors["block_was_deleted"])
            logging.info(f"ПОМИЛКА {message.from_user.username}: користувач видалив блок.")
        elif schedules_by_day:
            # Комбінований Розклад успішно створено.
            formatted_schedule = await format_schedules(schedules_by_day, week_type)
            await message.answer(formatted_schedule, parse_mode=ParseMode.HTML, disable_web_page_preview=True)
        else:
            # Комбінований розклад пустий.
            await message.answer(text=errors["not_schedules"], reply_markup=block_start())
    except SQLAlchemyError as e:
        # Помилка на рівні бази даних.
        await message.answer(text=errors["DBError"])
        logging.info(f"ПОМИЛКА {message.from_user.username}: помилка бази даних, {e}.")
    finally:
        session.close()


async def find_current_schedule(schedules_by_day: dict) -> str:
    """Функція для пошуку заняття, що відбувається зараз."""
    current_time = datetime.datetime.now().time()
    current_day = datetime.datetime.now().isoweekday()

    if current_day not in schedules_by_day:
        return "Сьогодні немає занять."

    day_schedules = schedules_by_day[current_day]
    sorted_schedules = sorted(day_schedules, key=lambda s: s.TimeStart)

    for schedule in sorted_schedules:
        if schedule.TimeStart <= current_time <= schedule.TimeEnd:
            return await build_nextnow(schedule)

    return "Наразі занять немає. "


async def find_next_schedule(schedules_by_day: dict) -> str:
    """Функція для пошуку наступного заняття."""
    current_time = datetime.datetime.now().time()
    current_day = datetime.datetime.now().isoweekday()

    if current_day not in schedules_by_day:
        return "Сьогодні немає занять."

    day_schedules = schedules_by_day[current_day]
    sorted_schedules = sorted(day_schedules, key=lambda s: s.TimeStart)

    next_schedule = None

    for schedule in sorted_schedules:
        if schedule.TimeStart > current_time:
            next_schedule = schedule
            break

    if next_schedule:
        return await build_nextnow(next_schedule)

    return "Наступних занять не заплановано."


async def build_nextnow(data):
    """"Функція створення повідомлення поточного або наступного заняття"""
    alert_text = await get_active_alerts()

    lesson_title = f"<b>{data.Title}</b>\n"
    time = f"<b>{data.TimeStart.strftime('%H:%M')} - {data.TimeEnd.strftime('%H:%M')}</b>\n"
    cabinet = f"<b><i>{data.Cabinet}</i></b>\n" if data.Cabinet else ""

    if data.LinkFirst and data.LinkSecond:
        lesson_type = f'<a href="{data.LinkFirst}">I</a> <a href="{data.LinkSecond}">II</a>\n'
    elif data.LinkFirst and not data.LinkSecond:
        lesson_type = f'<a href="{data.LinkFirst}">{data.LessonType}</a>\n'
    elif data.LinkSecond and not data.LinkFirst:
        lesson_type = f'<a href="{data.LinkSecond}">{data.LessonType}</a>\n'
    else:
        lesson_type = f"{data.LessonType}\n"

    return f"{lesson_title}{time}{cabinet}<i>{lesson_type}</i>{alert_text}"


@router.message(Command("schedule"))
@router.message(F.text.lower() == "поточний тиждень")
async def get_schedules(message: types.Message):
    await send_schedule(message, False)


@router.message(Command("nextschedule"))
@router.message(F.text.lower() == "наступний тиждень")
async def get_next_schedule(message: types.Message):
    await send_schedule(message, True)


@router.message(Command("now"))
@router.message(F.text.lower() == "поточне заняття")
async def get_current_schedule(message: types.Message):
    """Функція для отримання заняття, що відбувається наразі."""
    session = session_factory()
    chat_id = message.chat.id
    try:
        schedules_by_day = await fetch_combined_schedules(session, chat_id, False)
        if schedules_by_day == 0:
            await message.answer(text=errors["block_was_deleted"])
            logging.info(f"ПОМИЛКА {message.from_user.username}: користувач видалив блок.")
        elif schedules_by_day:
            current_lesson = await find_current_schedule(schedules_by_day)
            await message.answer(current_lesson, parse_mode=ParseMode.HTML, disable_web_page_preview=True)
        else:
            await message.answer(text=errors["not_schedules"], reply_markup=block_start())
    except SQLAlchemyError as e:
        # Помилка на рівні бази даних.
        await message.answer(text=errors["DBError"])
        logging.info(f"ПОМИЛКА {message.from_user.username}: помилка бази даних, {e}.")
    finally:
        session.close()


@router.message(Command("next"))
@router.message(F.text.lower() == "наступне заняття")
async def handle_next_command(message: types.Message):
    """Функція для отримання заняття, що буде відбуватися після того, що наразі."""
    session = session_factory()
    chat_id = message.chat.id
    try:
        schedules_by_day = await fetch_combined_schedules(session, chat_id, False)
        if schedules_by_day == 0:
            await message.answer(text=errors["block_was_deleted"])
            logging.info(f"ПОМИЛКА {message.from_user.username}: користувач видалив блок.")
        elif schedules_by_day:
            next_lesson = await find_next_schedule(schedules_by_day)
            await message.answer(next_lesson, parse_mode=ParseMode.HTML, disable_web_page_preview=True)
        else:
            await message.answer(text=errors["not_schedules"], reply_markup=block_start())
    except SQLAlchemyError as e:
        # Помилка на рівні бази даних.
        await message.answer(text=errors["DBError"])
        logging.info(f"ПОМИЛКА {message.from_user.username}: помилка бази даних, {e}.")
    finally:
        session.close()
