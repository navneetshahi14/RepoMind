from sqlalchemy import *
from sqlalchemy.orm import relationship

from app.database.base import Base

sources = relationship(
    "Source",
    backref="user"
)

class User(Base):
    
    __tablename__ = "users"
    
    id = Column(
        Integer,
        primary_key=True
    )
    
    email = Column(
        String,
        unique=True
    )
    
    name = Column(
        String,
        nullable=False
    )
    
    hashed_password = Column(
        String,
        nullable=False
    )
    image = Column(
        String
    )
    
    created_at = Column(
        DateTime
    )