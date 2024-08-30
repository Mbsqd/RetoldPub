from aiogram.types import ReplyKeyboardMarkup
from aiogram.utils.keyboard import ReplyKeyboardBuilder


def create_main_keyboard() -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    builder.button(text="Поточний тиждень")
    builder.button(text="Наступний тиждень")
    builder.button(text="Консультації")
    builder.button(text="Поточне заняття")
    builder.button(text="Наступне заняття")
    builder.adjust(2, 1, 2)
    return builder.as_markup(resize_keyboard=True)
