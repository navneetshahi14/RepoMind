from uuid import UUID
from pydantic import BaseModel, ConfigDict


class ChunkResponse(BaseModel):
    id: UUID
    source_id: UUID
    file_node_id: UUID
    chunk_index: int
    content: str
    token_count: int

    model_config = ConfigDict(
        from_attributes=True
    )