from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.dependencies.auth_dependency import get_current_user
from app.schema.chat_schema import ChatRequest
from app.services.chat_service import (
    chat_with_repository,
    stream_chat_with_repository,
)


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post("/")
def chat(
    payload: ChatRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return chat_with_repository(
        db,
        payload.session_id,
        payload.question,
        current_user.id,
        payload.model,
    )


@router.post("/stream")
def stream_chat(
    payload: ChatRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    generator = stream_chat_with_repository(
        db,
        payload.session_id,
        payload.question,
        current_user.id,
        payload.model,
    )
    return StreamingResponse(generator, media_type="text/event-stream")