from sqlalchemy import *

from app.database.base import Base


class Subscription(Base):

    __tablename__ = "subscriptions"

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

    plan = Column(
        String,
        default="free"
    )

    status = Column(
        String,
        default="active"
    )
    
    stripe_customer_id = Column(
        String,
        nullable=True
    )
    
    stripe_subscription_id = Column(
        String,
        nullable=True
    )