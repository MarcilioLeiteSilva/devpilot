from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    APP_NAME: str = "DevPilot"
    APP_VERSION: str = "0.1.0"
    APP_ENV: str = "development"
    
    # Database connections
    DATABASE_URL: str = Field(default="postgresql+asyncpg://postgres:postgres@localhost:5432/devpilot")
    REDIS_URL: str = Field(default="redis://localhost:6379/0")
    QDRANT_URL: str = Field(default="http://localhost:6333")
    
    # JWT security
    JWT_SECRET: str = Field(default="super_secret_jwt_key_change_me_in_production")
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
