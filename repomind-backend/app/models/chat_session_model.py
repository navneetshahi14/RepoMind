from sqlalchemy import *
from app.database.base import Base

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(
        Integer,
        primary_key=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    source_id = Column(
        Integer,
        ForeignKey("sources.id")
    )

    title = Column(
        String
    )