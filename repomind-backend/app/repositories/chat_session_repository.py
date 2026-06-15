from uuid import UUID
from sqlalchemy.orm import Session

from app.models.chat_session_model import ChatSession


def create_chat_session(
    db: Session,
    chat_session: ChatSession
):
    db.add(chat_session)
    db.commit()
    db.refresh(chat_session)

    return chat_session


def get_chat_session(
    db: Session,
    session_id: UUID
):
    return (
        db.query(ChatSession)
        .filter(ChatSession.id == session_id)
        .first()
    )


def get_project_sessions(
    db: Session,
    project_id: UUID
):
    return (
        db.query(ChatSession)
        .filter(ChatSession.project_id == project_id)
        .all()
    )


def get_user_sessions(
    db: Session,
    user_id: UUID
):
    return (
        db.query(ChatSession)
        .filter(ChatSession.user_id == user_id)
        .order_by(ChatSession.updated_at.desc())
        .all()
    )


def delete_chat_session(
    db: Session,
    chat_session: ChatSession
):
    db.delete(chat_session)
    db.commit()