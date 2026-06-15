from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class MessageCreate(BaseModel):
    session_id: UUID
    role: str
    content: str


class MessageResponse(BaseModel):
    id: UUID
    session_id: UUID
    role: str
    content: str
    model: str | None
    input_tokens: int | None
    output_tokens: int | None
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )