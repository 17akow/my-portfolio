from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./app/data/portfolio.db"
    groq_api_key: str = ""
    telegram_bot_token: str = ""
    telegram_chat_id: str = ""
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    ai_model: str = "llama-3.3-70b-versatile"
    ai_temperature: float = 0.7
    ai_max_tokens: int = 1024
    rate_limit_per_minute: int = 20

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


settings = Settings()
