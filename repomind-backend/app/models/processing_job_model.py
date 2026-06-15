from app.models.base import Base, UUIDMixin,TimestampMixin, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String, Text

class ProcessingJob(Base, UUIDMixin):
    __tablename__ = "processing_jobs"

    source_id: Mapped[UUID] = mapped_column(
        ForeignKey("sources.id")
    )

    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="PENDING"
    )

    error_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )