import logging

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import ContactMessage
from app.schemas.schemas import ContactCreate, ContactSuccess
from app.services.telegram import send_telegram_notification

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/contact", tags=["Contact"])


@router.post("", response_model=ContactSuccess, status_code=201)
async def submit_contact(
    body: ContactCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    contact = ContactMessage(
        name=body.name,
        email=body.email,
        subject=body.subject,
        message=body.message,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)

    try:
        await send_telegram_notification(
            name=body.name,
            email=body.email,
            subject=body.subject,
            message=body.message,
        )
    except Exception as e:
        logger.error(f"Failed to send Telegram notification: {e}")

    return ContactSuccess()
