import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import ChatMessage
from app.schemas.schemas import ChatRequest, ChatResponse
from app.services.groq_client import get_ai_response
from app.config import settings

router = APIRouter(prefix="/ai", tags=["AI Chat"])


def build_history(db_messages: list[ChatMessage]) -> list[dict[str, str]]:
    return [{"role": m.role, "content": m.content} for m in db_messages]


@router.post("/chat", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    db: Session = Depends(get_db),
):
    session_id = body.session_id or str(uuid.uuid4())

    prev_messages: list[ChatMessage] = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )
    history = build_history(prev_messages)

    reply, tokens_used = await get_ai_response(
        message=body.message,
        conversation_history=history,
    )

    db.add(ChatMessage(session_id=session_id, role="user", content=body.message))
    db.add(
        ChatMessage(
            session_id=session_id,
            role="assistant",
            content=reply,
            tokens_used=tokens_used,
            model=settings.ai_model,
        )
    )
    db.commit()

    return ChatResponse(session_id=session_id, reply=reply, tokens_used=tokens_used)
