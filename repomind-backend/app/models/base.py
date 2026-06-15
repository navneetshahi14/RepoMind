import uuid
from sqlalchemy import DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column
from app.database.base import Base

class TimestampMixin:
    created_at = mapped_column(DateTime, server_default=func.now())
    updated_at = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )
    
class UUIDMixin:
    id = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

