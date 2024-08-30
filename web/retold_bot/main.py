import asyncio
from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage
from files.config_data import config
from tgLogs.logger import logger_bot
from handlers import start, schedules, consultations, very_important


bot = Bot(token=config.bot_token)
dp = Dispatcher()


async def main():
    telegram_bot = Bot(token=config.bot_token)
    telegram_dispatcher = Dispatcher(storage=MemoryStorage())

    telegram_dispatcher.include_routers(start.router, schedules.router, consultations.router, very_important.router)

    await telegram_dispatcher.start_polling(telegram_bot)


if __name__ == "__main__":
    logger_bot()
    asyncio.run(main())
