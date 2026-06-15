from app.models.base import Base, UUIDMixin,TimestampMixin, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String, Text, Integer

class Message(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "messages"

    session_id: Mapped[UUID] = mapped_column(
        ForeignKey("chat_sessions.id")
    )

    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    model: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    input_tokens: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    output_tokens: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    session = relationship(
        "ChatSession",
        back_populates="messages"
    )