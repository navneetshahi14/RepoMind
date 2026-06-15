from uuid import UUID
from pydantic import BaseModel, ConfigDict


class CitationResponse(BaseModel):
    id: UUID
    message_id: UUID
    chunk_id: UUID
    file_path: str

    model_config = ConfigDict(
        from_attributes=True
    )