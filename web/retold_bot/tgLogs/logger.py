import os
import logging

# Создаем директорию, если она не существует
if not os.path.exists('logs'):
    os.makedirs('logs')

file_log = logging.FileHandler("logs/bot.log", 'w', encoding="utf-8")
console_out = logging.StreamHandler()

def logger_bot():
    logging.basicConfig(handlers=(file_log, console_out),
                        format='%(asctime)s %(message)s',
                        datefmt='%m/%d/%Y %H:%M:%S',
                        level=logging.INFO)