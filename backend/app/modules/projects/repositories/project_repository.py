from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_, func
from typing import List, Optional, Tuple
from app.modules.projects.models.project import Project, ProjectStatus, ProjectPriority, ProjectType

class ProjectRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, project: Project) -> Project:
        """Saves a new project to the database"""
        self.db.add(project)
        await self.db.commit()
        await self.db.refresh(project)
        return project

    async def get_by_id(self, project_id: int) -> Optional[Project]:
        """Retrieves a project by its primary key ID"""
        result = await self.db.execute(select(Project).filter(Project.id == project_id))
        return result.scalars().first()

    async def get_by_slug(self, slug: str) -> Optional[Project]:
        """Retrieves a project by its unique URL slug"""
        result = await self.db.execute(select(Project).filter(Project.slug == slug))
        return result.scalars().first()

    async def list_projects(
        self,
        status: Optional[ProjectStatus] = None,
        priority: Optional[ProjectPriority] = None,
        project_type: Optional[ProjectType] = None,
        search: Optional[str] = None,
        page: int = 1,
        limit: int = 10,
        include_archived: bool = True
    ) -> Tuple[List[Project], int]:
        """Lists projects with optional filter parameters and pagination support"""
        query = select(Project)
        
        # Filtering soft-deleted/archived projects by default unless specified
        if not include_archived:
            query = query.filter(Project.is_archived == False)
            
        if status:
            query = query.filter(Project.status == status)
        if priority:
            query = query.filter(Project.priority == priority)
        if project_type:
            query = query.filter(Project.project_type == project_type)
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    Project.name.ilike(search_filter),
                    Project.slug.ilike(search_filter),
                    Project.description.ilike(search_filter)
                )
            )
            
        # Count total matches matching criteria
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()

        # Ordering & Pagination
        query = query.order_by(Project.created_at.desc())
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)
        
        result = await self.db.execute(query)
        items = result.scalars().all()
        
        return items, total

    async def update(self, project: Project) -> Project:
        """Commits changes on an already modified project instance"""
        await self.db.commit()
        await self.db.refresh(project)
        return project

    async def delete(self, project: Project) -> Project:
        """Performs a soft-delete by setting the archive fields"""
        project.is_archived = True
        project.status = ProjectStatus.ARCHIVED
        await self.db.commit()
        await self.db.refresh(project)
        return project
