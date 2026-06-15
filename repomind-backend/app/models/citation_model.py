from app.models.base import Base, UUIDMixin,TimestampMixin, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String


class Citation(Base, UUIDMixin):
    __tablename__ = "citations"

    message_id: Mapped[UUID] = mapped_column(
        ForeignKey("messages.id")
    )

    chunk_id: Mapped[UUID] = mapped_column(
        ForeignKey(
            "chunks.id",
            ondelete="CASCADE"
        )
    )

    file_path: Mapped[str] = mapped_column(
        String,
        nullable=False
    )
    
    chunk = relationship(
        "Chunk",
        back_populates="citations"
    )