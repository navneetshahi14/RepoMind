from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schema.message_schema import (
    MessageCreate,
    MessageResponse
)
from app.services.message_service import (
    create_message_service,
    get_session_message_service
)

router = APIRouter(
    prefix="/messages",
    tags=["Messages"]
)


@router.post(
    "/",
    response_model=MessageResponse
)
def create_message(
    payload: MessageCreate,
    db: Session = Depends(get_db)
):
    return create_message_service(
        db,
        payload.session_id,
        payload.role,
        payload.content
    )


@router.get(
    "/{session_id}",
    response_model=list[MessageResponse]
)
def get_messages(
    session_id: UUID,
    db: Session = Depends(get_db)
):
    return get_session_message_service(
        db,
        session_id
    )