from sqlalchemy.orm import Session
from app.models.chat_session_model import ChatSession
from app.models.message_model import Message

def create_chat_session(
    db:Session,
    user_id,
    source_id,
    title
):
    session = ChatSession(
        user_id = user_id,
        source_id = source_id,
        title = title
    )
    
    db.add(session)
    db.commit()
    db.refresh(session)
    
    return session

def save_message(
    db:Session,
    session_id,
    role,
    content
):
    message = Message(
        session_id=session_id,
        role=role,
        content=content
    )

    db.add(message)
    db.commit()
    
    return message