import math
from fastapi import APIRouter, Depends, HTTPException, Query, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.core.database import get_db
from app.modules.projects.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListResponse
from app.modules.projects.services.project_service import ProjectService
from app.modules.projects.models.project import ProjectStatus, ProjectPriority, ProjectType

router = APIRouter(prefix="/api/projects", tags=["Projects"])

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_new_project(data: ProjectCreate, db: AsyncSession = Depends(get_db)):
    """Creates a new workspace project in DevPilot"""
    service = ProjectService(db)
    return await service.create_project(data)

@router.get("", response_model=ProjectListResponse)
async def list_projects(
    status: Optional[ProjectStatus] = Query(None, description="Filter by project status"),
    priority: Optional[ProjectPriority] = Query(None, description="Filter by project priority"),
    project_type: Optional[ProjectType] = Query(None, description="Filter by project type"),
    search: Optional[str] = Query(None, description="Search term in name, slug or description"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    include_archived: bool = Query(True, description="Include archived projects in the list"),
    db: AsyncSession = Depends(get_db)
):
    """Lists, searches, and filters projects with pagination"""
    service = ProjectService(db)
    items, total = await service.list_projects(
        status_filter=status,
        priority=priority,
        project_type=project_type,
        search=search,
        page=page,
        limit=limit,
        include_archived=include_archived
    )
    pages = max(1, math.ceil(total / limit))
    return {
        "items": items,
        "total": total,
        "page": page,
        "pages": pages
    }

@router.get("/slug/{slug}", response_model=ProjectResponse)
async def get_project_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    """Retrieves a single project's details using its unique URL slug"""
    service = ProjectService(db)
    return await service.get_by_slug(slug)

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project_by_id(project_id: int, db: AsyncSession = Depends(get_db)):
    """Retrieves a single project's details by its ID"""
    service = ProjectService(db)
    return await service.get_project(project_id)

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: int, data: ProjectUpdate, db: AsyncSession = Depends(get_db)):
    """Updates an existing project's attributes"""
    service = ProjectService(db)
    return await service.update_project(project_id, data)

@router.patch("/{project_id}/archive", response_model=ProjectResponse)
async def archive_project(project_id: int, db: AsyncSession = Depends(get_db)):
    """Soft-archives a project from standard search and sets status to ARCHIVED"""
    service = ProjectService(db)
    return await service.archive_project(project_id)

@router.delete("/{project_id}", response_model=ProjectResponse)
async def delete_project(project_id: int, db: AsyncSession = Depends(get_db)):
    """Soft-deletes a project by marking it as archived and setting status to ARCHIVED"""
    service = ProjectService(db)
    return await service.delete_project(project_id)
