from app.models.base import Base, UUIDMixin,TimestampMixin, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String, Text

class Source(Base,UUIDMixin,TimestampMixin):
    __tablename__ = "sources"

    project_id:Mapped[UUID] = mapped_column(
        ForeignKey("projects.id")
    )

    type:Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )
    source_url:Mapped[str | None] = mapped_column(
        String,
        nullable=True
    )
    file_name:Mapped[str|None] = mapped_column(
        String(255),
        nullable=True
    )
    status:Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="PENDING"
    )
    error_message:Mapped[str| None] = mapped_column(
        Text,
        nullable=True
    )
    project = relationship(
        "Project",
        back_populates="sources"
    )
    file_nodes = relationship(
        "FileNode",
        back_populates="source",
        cascade="all, delete-orphan"
    )