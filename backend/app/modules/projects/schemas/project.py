from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from app.modules.projects.models.project import ProjectStatus, ProjectPriority, ProjectType

class ProjectBase(BaseModel):
    name: str = Field(..., max_length=150, min_length=1)
    slug: str = Field(..., max_length=150, min_length=1)
    description: Optional[str] = Field(None, max_length=5000)
    status: ProjectStatus = ProjectStatus.IDEA
    priority: ProjectPriority = ProjectPriority.MEDIUM
    project_type: ProjectType
    stack: List[str] = Field(default_factory=list)
    github_url: Optional[str] = Field(None, max_length=255)
    production_url: Optional[str] = Field(None, max_length=255)

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=150, min_length=1)
    slug: Optional[str] = Field(None, max_length=150, min_length=1)
    description: Optional[str] = Field(None, max_length=5000)
    status: Optional[ProjectStatus] = None
    priority: Optional[ProjectPriority] = None
    project_type: Optional[ProjectType] = None
    stack: Optional[List[str]] = None
    github_url: Optional[str] = Field(None, max_length=255)
    production_url: Optional[str] = Field(None, max_length=255)
    is_archived: Optional[bool] = None

class ProjectResponse(BaseModel):
    id: int
    uuid: UUID
    name: str
    slug: str
    description: Optional[str] = None
    status: ProjectStatus
    priority: ProjectPriority
    project_type: ProjectType
    stack: List[str]
    github_url: Optional[str] = None
    production_url: Optional[str] = None
    is_archived: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProjectListResponse(BaseModel):
    items: List[ProjectResponse]
    total: int
    page: int
    pages: int
