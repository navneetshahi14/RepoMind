from uuid import UUID
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.chat_session_model import ChatSession
from app.models.project_model import Project
from app.repositories.chat_session_repository import (
    create_chat_session,
    delete_chat_session,
    get_chat_session,
    get_project_sessions,
    get_user_sessions,
)


def _ensure_project_owner(
    db: Session,
    project_id: UUID,
    user_id: UUID
):
    """
    Fetch the project, verify the caller owns it, and return it.
    Raises 404 if missing, 403 if the user doesn't own it.
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    return project


def create_chat_session_service(
    db:Session,
    project_id:UUID,
    user_id:UUID,
    title: str | None
):
    # Don't let a user create a chat session in a project they don't own.
    _ensure_project_owner(db, project_id, user_id)

    session = ChatSession(
        project_id=project_id,
        user_id=user_id,
        title=title
    )

    return create_chat_session(
        db,
        session
    )


def get_project_sessions_service(
    db:Session,
    project_id:UUID,
    user_id:UUID
):
    _ensure_project_owner(db, project_id, user_id)
    return get_project_sessions(
        db,
        project_id
    )


def get_user_sessions_service(
    db: Session,
    user_id: UUID
):
    return get_user_sessions(db, user_id)


def delete_chat_session_service(
    db: Session,
    session_id: UUID,
    user_id: UUID
):
    """
    Delete a chat session. Verifies ownership first.
    Raises 404 if missing, 403 if not the owner.
    """
    session = get_chat_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    if session.user_id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    delete_chat_session(db, session)
    return None