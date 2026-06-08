from app.database.base import Base
from sqlalchemy import *

class Message(Base):
    __tablename__ = "messages   "

    id = Column(
        Integer,
        primary_key=True
    )

    session_id = Column(
        Integer,
        ForeignKey(
            "chat_sessions.id"
        )
    )

    role = Column(
        String
    )

    content = Column(
        Text
    )