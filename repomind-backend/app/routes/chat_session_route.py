from uuid import UUID

from fastapi.responses import StreamingResponse
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.auth_dependency import get_current_user
from app.database.dependencies import get_db
from app.schema.chat_session_schema import (
    ChatSessionCreate,
    ChatSessionResponse
)

from app.schema.chat_schema import ChatRequest
from app.services.chat_service import (
    chat_with_repository,
    stream_chat_with_repository,
)

from app.services.chat_session_service import (
    create_chat_session_service,
    delete_chat_session_service,
    get_project_sessions_service,
    get_user_sessions_service,
)

router = APIRouter(
    prefix="/chat",
    tags=["Chat Sessions"]
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


@router.post(
    "/sessions",
    response_model=ChatSessionResponse
)
def create_chat_session(
    payload: ChatSessionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return create_chat_session_service(
        db,
        payload.project_id,
        current_user.id,
        payload.title
    )


@router.get(
    "/sessions",
    response_model=list[ChatSessionResponse]
)
def list_my_sessions(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    List all chat sessions belonging to the current user, newest first.
    Used by the chat sidebar to show the user's full history.
    """
    return get_user_sessions_service(db, current_user.id)


@router.get(
    "/sessions/project/{project_id}",
    response_model=list[ChatSessionResponse]
)
def get_project_sessions(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_project_sessions_service(
        db,
        project_id,
        current_user.id
    )


@router.delete(
    "/sessions/{session_id}",
    status_code=204
)
def delete_chat_session(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    delete_chat_session_service(db, session_id, current_user.id)
    return None