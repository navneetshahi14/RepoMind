from uuid import UUID
from sqlalchemy.orm import Session

from app.models.message_model import Message


def create_message(
    db: Session,
    message: Message
):
    db.add(message)
    db.commit()
    db.refresh(message)

    return message


def get_session_messages(
    db: Session,
    session_id: UUID
):
    return (
        db.query(Message)
        .filter(Message.session_id == session_id)
        .order_by(Message.created_at)
        .all()
    )