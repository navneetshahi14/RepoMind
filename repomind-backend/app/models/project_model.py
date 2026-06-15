from app.models.base import Base, UUIDMixin,TimestampMixin, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String, Text

class Project(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "projects"

    name :Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )
    description: Mapped[str|None] = mapped_column(
        Text,
        nullable=True
    )
    owner_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id")
    )
    owner=relationship(
        "User",
        back_populates="projects"
    )
    sources = relationship(
        "Source",
        back_populates="project",
        cascade="all, delete-orphan"
    )
    chat_sessions = relationship(
        "ChatSession",
        back_populates="project",
        cascade="all, delete-orphan"
    )