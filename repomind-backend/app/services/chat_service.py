import uuid
from typing import Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.message_model import Message
from app.repositories.chat_session_repository import (
    get_chat_session,
)
from app.repositories.message_repository import (
    create_message,
)
from app.services.citation_service import (
    save_citations,
)
from app.services.search_service import (
    semantic_search,
)
from app.services.rag_service import (
    build_context,
    generate_answer,
    stream_answer,
)


def _resolve_session(
    db: Session, session_id: uuid.UUID, user_id: uuid.UUID
):
    """
    Fetch the chat session, verify the caller owns it, and return it.
    Raises 404 if missing, 403 if the user doesn't own it.
    """
    session = get_chat_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    if session.user_id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    return session


def chat_with_repository(
    db: Session,
    session_id: uuid.UUID,
    question: str,
    user_id: uuid.UUID,
    model: Optional[str] = None,
):
    """
    Non-streaming RAG answer.

    1. Resolve session → project; verify ownership.
    2. Persist the user message.
    3. Run project-scoped semantic search.
    4. Generate answer and persist the assistant message.
    5. Save citations (one per retrieved chunk).
    """
    session = _resolve_session(db, session_id, user_id)
    project_id = session.project_id

    # Persist the user message.
    user_message = Message(
        session_id=session_id,
        role="USER",
        content=question,
    )
    user_message = create_message(db, user_message)

    # Project-scoped retrieval.
    chunks = semantic_search(
        db,
        question,
        top_k=5,
        project_id=project_id,
    )

    context = build_context(chunks)
    answer = generate_answer(context, question)

    # Persist the assistant message.
    assistant_message = Message(
        session_id=session_id,
        role="ASSISTANT",
        content=answer,
        model=model,
    )
    assistant_message = create_message(db, assistant_message)

    # Citations for the assistant message.
    save_citations(db, assistant_message.id, chunks)

    return {
        "answer": answer,
        "message_id": str(assistant_message.id),
        "session_id": str(session_id),
        "sources": [
            {
                "id": str(c.id),
                "chunk_id": str(c.id),
                "path": c.file_node.path,
                "file": c.file_node.name,
                "excerpt": c.content[:200],
            }
            for c in chunks
        ],
    }


def stream_chat_with_repository(
    db: Session,
    session_id: uuid.UUID,
    question: str,
    user_id: uuid.UUID,
    model: Optional[str] = None,
):
   
    session = _resolve_session(db, session_id, user_id)
    project_id = session.project_id

    user_message = Message(
        session_id=session_id,
        role="USER",
        content=question,
    )
    user_message = create_message(db, user_message)

    chunks = semantic_search(
        db,
        question,
        top_k=5,
        project_id=project_id,
    )

    context = build_context(chunks)

    full_answer_parts = []

    for delta in stream_answer(context, question):
        full_answer_parts.append(delta)
        yield delta

    full_answer = "".join(full_answer_parts)
    print(full_answer)

    assistant_message = Message(
        session_id=session_id,
        role="ASSISTANT",
        content=full_answer,
        model=model,
    )
    assistant_message = create_message(db, assistant_message)

    save_citations(db, assistant_message.id, chunks)