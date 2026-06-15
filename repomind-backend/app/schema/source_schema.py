from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class SourceCreate(BaseModel):
    project_id: UUID
    type: str
    source_url: str | None = None
    file_url: str | None = None


class SourceResponse(BaseModel):
    id: UUID
    project_id: UUID
    type: str
    source_url: str | None = None
    file_name: str | None = None
    status: str
    error_message: str | None = None
    created_at: datetime
    updated_at: datetime
    chunks: int
    files: int

    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True,
    )
    
class ProjectSourcesResponse(BaseModel):
    sources: list[SourceResponse]
    total_chunks: int
    total_files: int