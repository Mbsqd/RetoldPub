from aiogram import Router, types
from aiogram.filters import Command

router = Router()


@router.message(Command("help"))
async def send_help(message: types.Message):
    await message.answer_video(video='https://media1.tenor.com/m/deQGTPyz5nYAAAAd/ryan-gosling-emma-stone.gif')