import logging

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

TELEGRAM_API = f"https://api.telegram.org/bot{settings.telegram_bot_token}"


async def send_telegram_notification(name: str, email: str, subject: str, message: str) -> bool:
    if not settings.telegram_bot_token or not settings.telegram_chat_id:
        logger.warning("Telegram not configured - skipping notification")
        return False

    text = (
        f"<b>📬 New Contact Form Submission</b>\n\n"
        f"<b>From:</b> {name}\n"
        f"<b>Email:</b> {email}\n"
        f"<b>Subject:</b> {subject or 'No subject'}\n"
        f"<b>Message:</b>\n{message[:2000]}"
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
