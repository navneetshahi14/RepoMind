from app.models.base import Base, UUIDMixin,TimestampMixin, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String

class ChatSession(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "chat_sessions"

    project_id: Mapped[UUID] = mapped_column(
        ForeignKey("projects.id")
    )

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id")
    )

    title: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    user = relationship(
        "User",
        back_populates="chat_sessions"
    )

    project = relationship(
        "Project",
        back_populates="chat_sessions"
    )

    messages = relationship(
        "Message",
        back_populates="session",
        cascade="all, delete-orphan"
    )