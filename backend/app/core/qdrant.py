import logging
from qdrant_client import AsyncQdrantClient
from app.core.config import settings

logger = logging.getLogger(__name__)

# Initialize Qdrant Client from config
qdrant_client = AsyncQdrantClient(url=settings.QDRANT_URL, check_compatibility=False)

async def verify_qdrant_connection() -> bool:
    """Validates Qdrant connectivity by fetching collections list"""
    try:
        await qdrant_client.get_collections()
        return True
    except Exception as e:
        logger.error(f"Qdrant connection validation failed: {e}")
        return False
