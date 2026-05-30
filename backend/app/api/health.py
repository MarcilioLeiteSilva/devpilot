from fastapi import APIRouter, Response, status
from app.core.config import settings
from app.core.database import verify_database_connection
from app.core.redis import verify_redis_connection
from app.core.qdrant import verify_qdrant_connection

router = APIRouter()

@router.get("/health")
async def health_check(response: Response):
    """Checks the health of the API and its dependent databases (Postgres, Redis, Qdrant)"""
    postgres_ok = await verify_database_connection()
    redis_ok = await verify_redis_connection()
    qdrant_ok = await verify_qdrant_connection()
    
    is_healthy = postgres_ok and redis_ok and qdrant_ok
    if not is_healthy:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "api": "ok",
        "postgres": "ok" if postgres_ok else "error",
        "redis": "ok" if redis_ok else "error",
        "qdrant": "ok" if qdrant_ok else "error"
    }

@router.get("/api/status")
async def status_check():
    """Returns basic service status information"""
    return {
        "name": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "status": "running"
    }
