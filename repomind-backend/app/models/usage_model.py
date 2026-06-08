from sqlalchemy import *

from app.database.base import Base


class Usage(Base):

    __tablename__ = "usage_tracking"

    id = Column(
        Integer,
        primary_key=True
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id"
        )
    )

    pdf_count = Column(
        Integer,
        default=0
    )

    repo_count = Column(
        Integer,
        default=0
    )

    messages_count = Column(
        Integer,
        default=0
    )