import logging

from datetime import datetime
from zoneinfo import ZoneInfo

from database.database_connect import config
from alerts_in_ua import Client as AlertsClient

# Словарь для хранения результатов функции с временным штампом.
cache = {}

# Время жизни кэша в секундах.
CACHE_EXPIRY_SECONDS = 75


async def get_active_alerts():
    # Проверяем, есть ли результат в кэше и не истекло ли время его жизни.
    if 'result' in cache and 'timestamp' in cache:
        time_since_cached = datetime.now(ZoneInfo("Europe/Kiev")) - cache['timestamp']
        if time_since_cached.total_seconds() < CACHE_EXPIRY_SECONDS:
            # Возвращение сообщение, которое сохранено в кэше.
            return cache['result']

    # Если результат не найден в кэше или время его жизни истекло, обращаемся к API.
    alerts_client = AlertsClient(token=config.alerts_token)
    alert_status = str(alerts_client.get_air_raid_alert_status(9))

    # Получаем символ из файла.
    if "active" in alert_status:
        result = "🔴Повітряна тривога!"
        logging.info(f"Alert status: ALERT")
        # Обновляем кэш с результатом и текущим временем.
        cache['result'] = result
        cache['timestamp'] = datetime.now(ZoneInfo("Europe/Kiev"))
        return result
    else:
        if "no_alert" in alert_status:
            result = "🟢Немає чого трястися."
            logging.info(f"Alert status: SKY IS CLEAR")
            # Обновляем кэш с результатом и текущим временем.
            cache['result'] = result
            cache['timestamp'] = datetime.now(ZoneInfo("Europe/Kiev"))
            return result
