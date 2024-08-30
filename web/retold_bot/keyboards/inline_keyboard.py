from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton


def block_start() -> InlineKeyboardMarkup:
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[[InlineKeyboardButton(text="Заповнити таблицу", url="https://retold.com.ua/blocks")]])
    return keyboard


def site_keyboard() -> InlineKeyboardMarkup:
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[[InlineKeyboardButton(text="Перейти до сайту", url="https://retold.com.ua/profile")]])
    return keyboard
