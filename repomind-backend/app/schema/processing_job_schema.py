from uuid import UUID
from pydantic import BaseModel, ConfigDict


class ProcessingJobResponse(BaseModel):
    id: UUID
    source_id: UUID
    status: str
    error_message: str | None

    model_config = ConfigDict(
        from_attributes=True
    )