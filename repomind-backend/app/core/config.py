from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # LLM
    LLM_PROVIDER: str = "ollama"

    OLLAMA_MODEL: str = "llama3"
    OPENAI_MODEL: str = "gpt-4o-mini"
    GEMINI_MODEL: str = "gemini-2.5-flash"

    OLLAMA_BASE_URL: str = "http://localhost:11434"

    OPENAI_API_KEY: str | None = None
    GOOGLE_API_KEY: str | None = None

    # Embeddings
    EMBEDDING_PROVIDER: str = "ollama"
    OLLAMA_EMBEDDING_MODEL: str = "nomic-embed-text"

    # Ollama
    OLLAMA_HOST: str = "http://localhost:11434"
    OLLAMA_TIMEOUT: int = 120

    # Database
    DATABASE_URL: str

    # Qdrant
    QDRANT_URL: str | None = None
    QDRANT_API_KEY: str | None = None

    # Stripe
    STRIPE_SECRET_KEY: str | None = None
    STRIPE_WEBHOOK_SECRET: str | None = None
    PRO_PRICE_ID: str | None = None

    # JWT
    SECRET_KEY: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()