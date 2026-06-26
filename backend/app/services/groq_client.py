import logging

from groq import AsyncGroq

from app.config import settings

logger = logging.getLogger(__name__)

client = AsyncGroq(api_key=settings.groq_api_key)

SYSTEM_PROMPT = (
    "You are an AI assistant on an IT professional's portfolio website. "
    "Your role is to answer questions about the portfolio owner's skills, experience, projects, and background. "
    "Be concise, professional, and helpful. If asked about something you don't know, "
    "suggest the visitor use the contact form for specific inquiries. "
    "Keep responses under 500 words and format them in clear paragraphs. "
    "Do not make up information about the portfolio owner."
)


async def get_ai_response(
    message: str,
    conversation_history: list[dict[str, str]] | None = None,
) -> tuple[str, int]:
    if not settings.groq_api_key:
        return "AI chat is not configured. Please contact me directly via the form.", 0

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    if conversation_history:
        messages.extend(conversation_history[-10:])

    messages.append({"role": "user", "content": message})

    try:
        response = await client.chat.completions.create(
            model=settings.ai_model,
            messages=messages,
            temperature=settings.ai_temperature,
            max_tokens=settings.ai_max_tokens,
        )

        reply = response.choices[0].message.content or ""
        tokens_used = response.usage.total_tokens if response.usage else 0
        return reply, tokens_used

    except Exception as e:
        logger.error(f"Groq API error: {e}")
        return "I'm having trouble connecting to my AI service right now. Please try again later or use the contact form.", 0
