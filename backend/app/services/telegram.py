import logging

import httpx

from app.config import settings
from datetime import datetime
logger = logging.getLogger(__name__)
current_time = datetime.now().strftime("%d %b %Y • %H:%M")

TELEGRAM_API = f"https://api.telegram.org/bot{settings.telegram_bot_token}"


async def send_telegram_notification(name: str, email: str, subject: str, message: str) -> bool:
    if not settings.telegram_bot_token or not settings.telegram_chat_id:
        logger.warning("Telegram not configured - skipping notification")
        return False

    text = (

        f"📩 <b>New Portfolio Contact</b>\n\n"

        f"👤 <b>Name</b>\n"

        f"{name}\n\n"

        f"📧 <b>Email</b>\n"

        f"{email}\n\n"

        f"📝 <b>Subject</b>\n"

        f"{subject or 'No Subject'}\n\n"

        f"💬 <b>Message</b>\n"

        f"{message[:2000]}\n\n"

        f"🕒 <b>Time</b>\n"

        f"{current_time}\n\n"

        f"🌐 <b>Source</b>\n"

        f"Portfolio Website"

    )

    url = f"{TELEGRAM_API}/sendMessage"
    payload = {
        "chat_id": settings.telegram_chat_id,
        "text": text,
        "parse_mode": "HTML",
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            logger.info("Telegram notification sent successfully")
            return True
    except httpx.HTTPStatusError as e:
        logger.error(f"Telegram API error: {e.response.status_code} - {e.response.text}")
    except httpx.RequestError as e:
        logger.error(f"Telegram request failed: {e}")

    return False
