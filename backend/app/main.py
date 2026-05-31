from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.health import router as health_router
from app.modules.projects.routes.project_routes import router as projects_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="DevPilot AI - Development Agents Orchestration Platform"
)

# Configure CORS to allow Next.js frontend to make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount health & status routes
app.include_router(health_router)

# Mount projects module routes
app.include_router(projects_router)

