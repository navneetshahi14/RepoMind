from uuid import UUID
from pydantic import BaseModel, ConfigDict


class EmbeddingResponse(BaseModel):
    id: UUID
    vector_id: str
    provider: str
    model: str
    dimension: int

    model_config = ConfigDict(
        from_attributes=True
    )