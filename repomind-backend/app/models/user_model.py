from app.models.base import Base, UUIDMixin,TimestampMixin
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String

class User(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "users"

    name : Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False
    )
    hashed_password:Mapped[str] = mapped_column(
        String,
        nullable=False
    )
    full_name: Mapped[str|None] = mapped_column(
        String(255),
        nullable=True
    )
    avatar_url: Mapped[str|None] = mapped_column(
        String,
        nullable=True
    )
    projects = relationship(
        "Project",
        back_populates="owner",
        cascade="all, delete-orphan"
    )
    chat_sessions = relationship(
        "ChatSession",
        back_populates="user",
        cascade="all, delete-orphan"
    )