import enum
import uuid as uuid_pkg
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Text, Boolean, Integer, DateTime
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class ProjectStatus(str, enum.Enum):
    IDEA = "IDEA"
    PLANNING = "PLANNING"
    DEVELOPMENT = "DEVELOPMENT"
    TESTING = "TESTING"
    PUBLISHED = "PUBLISHED"
    PAUSED = "PAUSED"
    ARCHIVED = "ARCHIVED"

class ProjectPriority(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class ProjectType(str, enum.Enum):
    MOBILE_APP = "MOBILE_APP"
    WEB_APP = "WEB_APP"
    SAAS = "SAAS"
    API = "API"
    AGENT = "AGENT"
    AUTOMATION = "AUTOMATION"

class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    uuid: Mapped[uuid_pkg.UUID] = mapped_column(UUID(as_uuid=True), default=uuid_pkg.uuid4, unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    slug: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[ProjectStatus] = mapped_column(String(50), default=ProjectStatus.IDEA, nullable=False)
    priority: Mapped[ProjectPriority] = mapped_column(String(50), default=ProjectPriority.MEDIUM, nullable=False)
    project_type: Mapped[ProjectType] = mapped_column(String(50), nullable=False)
    stack: Mapped[List[str]] = mapped_column(JSONB, default=list, nullable=False)
    github_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    production_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
