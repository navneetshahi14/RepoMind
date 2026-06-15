from uuid import UUID

from sqlalchemy.orm import Session

from app.models.message_model import Message
from app.repositories.message_repository import (
    create_message,
    get_session_messages
)

def create_message_service(
    db:Session,
    session_id:UUID,
    role:str,
    content:str
):
    message = Message(
        session_id=session_id,
        role = role,
        content = content
    )
    
    return create_message(
        db,message
    )
    
def get_session_message_service(
    db:Session,
    session_id:UUID
):
    return get_session_messages(
        db,session_id
    )