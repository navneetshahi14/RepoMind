from sqlalchemy import * 
from app.database.base import Base

class Source(Base):
    __tablename__ = "sources"

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

    source_type = Column(
        String
    )

    source_name = Column(
        String
    )

    source_identifier = Column(
        String
    )