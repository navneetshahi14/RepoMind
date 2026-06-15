from app.models.base import Base, UUIDMixin,TimestampMixin, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String, BigInteger

class FileNode(Base, UUIDMixin):
    __tablename__ = "file_nodes"

    source_id: Mapped[UUID] = mapped_column(
        ForeignKey(
            "sources.id",
            ondelete="CASCADE"                   
        )
    )

    parent_id: Mapped[UUID | None] = mapped_column(
        ForeignKey(
            "file_nodes.id",
            ondelete="CASCADE"
        )
    )

    path: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    extension: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True
    )

    size: Mapped[int | None] = mapped_column(
        BigInteger,
        nullable=True
    )

    source = relationship(
        "Source",
        back_populates="file_nodes"
    )
    
    chunks = relationship( "Chunk", back_populates="file_node", cascade="all, delete-orphan" )