from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Tuple
from app.modules.projects.models.project import Project, ProjectStatus, ProjectPriority, ProjectType
from app.modules.projects.repositories.project_repository import ProjectRepository
from app.modules.projects.schemas.project import ProjectCreate, ProjectUpdate

class ProjectService:
    def __init__(self, db: AsyncSession):
        self.repo = ProjectRepository(db)

    async def create_project(self, data: ProjectCreate) -> Project:
        """Creates a new project and validates that the name is non-empty and the slug is unique"""
        if not data.name or not data.name.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project name is required"
            )
            
        # Check slug uniqueness
        existing = await self.repo.get_by_slug(data.slug)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Slug '{data.slug}' is already in use by another project"
            )
            
        project = Project(
            name=data.name.strip(),
            slug=data.slug.strip(),
            description=data.description,
            status=data.status,
            priority=data.priority,
            project_type=data.project_type,
            stack=data.stack,
            github_url=data.github_url,
            production_url=data.production_url,
            is_archived=False
        )
        return await self.repo.create(project)

    async def get_project(self, project_id: int) -> Project:
        """Retrieves a project by ID or raises 404 if not found"""
        project = await self.repo.get_by_id(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Project with ID {project_id} not found"
            )
        return project

    async def get_by_slug(self, slug: str) -> Project:
        """Retrieves a project by its URL slug or raises 404 if not found"""
        project = await self.repo.get_by_slug(slug)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Project with slug '{slug}' not found"
            )
        return project

    async def list_projects(
        self,
        status_filter: Optional[ProjectStatus] = None,
        priority: Optional[ProjectPriority] = None,
        project_type: Optional[ProjectType] = None,
        search: Optional[str] = None,
        page: int = 1,
        limit: int = 10,
        include_archived: bool = True
    ) -> Tuple[List[Project], int]:
        """Lists and paginates projects matching specified filters"""
        return await self.repo.list_projects(
            status=status_filter,
            priority=priority,
            project_type=project_type,
            search=search,
            page=page,
            limit=limit,
            include_archived=include_archived
        )

    async def update_project(self, project_id: int, data: ProjectUpdate) -> Project:
        """Updates project details, ensuring slug uniqueness if updated"""
        project = await self.get_project(project_id)
        
        # Check name if updated
        if data.name is not None:
            if not data.name.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Project name cannot be empty"
                )
            project.name = data.name.strip()
            
        # Check slug uniqueness if slug is updated
        if data.slug is not None:
            slug_val = data.slug.strip()
            if slug_val != project.slug:
                existing = await self.repo.get_by_slug(slug_val)
                if existing:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Slug '{slug_val}' is already in use by another project"
                    )
                project.slug = slug_val

        # Update remaining fields
        if data.description is not None:
            project.description = data.description
        if data.status is not None:
            project.status = data.status
        if data.priority is not None:
            project.priority = data.priority
        if data.project_type is not None:
            project.project_type = data.project_type
        if data.stack is not None:
            project.stack = data.stack
        if data.github_url is not None:
            project.github_url = data.github_url
        if data.production_url is not None:
            project.production_url = data.production_url
        if data.is_archived is not None:
            project.is_archived = data.is_archived
            if data.is_archived:
                project.status = ProjectStatus.ARCHIVED

        return await self.repo.update(project)

    async def archive_project(self, project_id: int) -> Project:
        """Soft-archives a project by updating its archived status and enum status"""
        project = await self.get_project(project_id)
        project.is_archived = True
        project.status = ProjectStatus.ARCHIVED
        return await self.repo.update(project)

    async def delete_project(self, project_id: int) -> Project:
        """Soft-deletes a project from active listings by setting archived fields"""
        project = await self.get_project(project_id)
        return await self.repo.delete(project)
