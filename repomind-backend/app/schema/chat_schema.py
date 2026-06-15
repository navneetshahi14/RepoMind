from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class ChatRequest(BaseModel):
    session_id: UUID
    question: str
    model: Optional[str] = None