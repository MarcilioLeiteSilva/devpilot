import logging
import redis.asyncio as aioredis
from app.core.config import settings

logger = logging.getLogger(__name__)

# Initialize Redis client from URL config
redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)

async def verify_redis_connection() -> bool:
    """Validates Redis connectivity by sending a PING command"""
    try:
        await redis_client.ping()
        return True
    except Exception as e:
        logger.error(f"Redis connection validation failed: {e}")
        return False
