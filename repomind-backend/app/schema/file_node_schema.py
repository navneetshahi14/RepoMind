from uuid import UUID
from pydantic import BaseModel, ConfigDict

class FileNodeResponse(BaseModel):
    id:UUID
    source_id:UUID
    parent_id:UUID| None
    path:str
    name:str
    extenstion:str| None
    size: int| None
    model_config = ConfigDict(
        from_attributes=True
    )