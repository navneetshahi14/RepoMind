from pydantic import BaseModel

class Source(BaseModel):
    file: str
    path: str | None = None
    page: int | None = None
    score: float