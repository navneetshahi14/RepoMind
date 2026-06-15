from app.models.base import Base, UUIDMixin,TimestampMixin, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String, Integer, Text

class Chunk(Base, UUIDMixin):
    __tablename__ = "chunks"

    source_id: Mapped[UUID] = mapped_column(
        ForeignKey("sources.id",ondelete="CASCADE")
    )

    file_node_id: Mapped[UUID] = mapped_column(
        ForeignKey("file_nodes.id",ondelete="CASCADE")
    )

    embedding_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("embeddings.id")
    )

    chunk_index: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    token_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0
    )
    
    file_node = relationship( "FileNode", back_populates="chunks" )
    
    citations = relationship(
        "Citation",
        back_populates="chunk",
        cascade="all, delete-orphan"
    )