import logging
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text
from app.core.config import settings

logger = logging.getLogger(__name__)

# SQLAlchemy 2.0 async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    future=True
)

# Session factory for handling async transactions
SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

class Base(DeclarativeBase):
    """Base class for SQLAlchemy models"""
    pass

async def get_db():
    """Dependency generator to retrieve database sessions"""
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def verify_database_connection() -> bool:
    """Validates PostgreSQL database connection using a quick query"""
    try:
        async with SessionLocal() as session:
            await session.execute(text("SELECT 1"))
        return True
    except Exception as e:
        logger.error(f"PostgreSQL connection validation failed: {e}")
        return False
