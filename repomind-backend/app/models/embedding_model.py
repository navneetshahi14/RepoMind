from app.models.base import Base, UUIDMixin,TimestampMixin, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String, Integer

class Embedding(Base, UUIDMixin):
    __tablename__ = "embeddings"

    vector_id: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    provider: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    model: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    dimension: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )