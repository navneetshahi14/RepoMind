from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class ChatSessionCreate(BaseModel):
    project_id: UUID
    title: str | None = None


class ChatSessionResponse(BaseModel):
    id: UUID
    project_id: UUID
    user_id: UUID
    title: str | None
    created_at: datetime
    updated_at: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True,
    )