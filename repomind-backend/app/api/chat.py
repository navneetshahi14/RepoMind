from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse

from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.dependency import get_db

from app.middleware.auth_middleware import (
    get_current_user
)

from app.schema.create_chat_schema import (
    CreateChatRequest
)

from app.services.chat_service import (
    create_chat_session
)

from app.models.chat_session_model import ChatSession

from app.services.retrieval_service import (
    retrieval_chunks,
    retrieve_repo_chunks
)

from app.services.prompt_service import (
    prompt_builder,
    build_repo_prompt
)

from app.services.llm_service import (
    generate_answer,
    generate_answer_stream
)

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)

class ChatRequest(BaseModel):
    question: str
    document_id: Optional[str] = None
    repo_id: Optional[str] = None
    session_id: Optional[str] = None
    


@router.post("/")
def chat(
    body: ChatRequest
):
    if not body.document_id:
        raise HTTPException(
            status_code=400,
            detail="document_id is required for PDF chat"
        )

    results = retrieval_chunks(
        body.question,
        document_id=body.document_id
    )

    context = "\n\n".join(
        [
            hit.payload["text"]
            for hit in results
        ]
    )

    prompt = prompt_builder(
        body.question,
        context
    )

    answer = generate_answer(
        prompt
    )

    return {
        "answer": answer
    }


@router.post("/stream")
def stream_chat(
    body: ChatRequest
):
    if body.repo_id:
        results = retrieve_repo_chunks(
            body.question,
            body.repo_id
        )

        context_parts = []

        for hit in results:
            payload = hit.payload
            context_parts.append(
                f"""
                FILE: {payload['file']}

                PATH: {payload['path']}

                CONTENT:
                {payload['text']}
                """
            )

        prompt = build_repo_prompt(
            body.question,
            "\n\n".join(context_parts)
        )
    elif body.document_id:
        results = retrieval_chunks(
            body.question,
            document_id=body.document_id
        )

        context = "\n\n".join(
            [
                hit.payload["text"]
                for hit in results
            ]
        )

        prompt = prompt_builder(
            body.question,
            context
        )
    else:
        raise HTTPException(
            status_code=400,
            detail="document_id or repo_id is required"
        )

    return StreamingResponse(
        generate_answer_stream(prompt),
        media_type="text/plain"
    )
    

@router.post("/sessions")
def create_chat(
        body: CreateChatRequest,
        db: Session = Depends(
            get_db
        ),
        current_user=Depends(
            get_current_user
        )
):

    session = create_chat_session(
        db,
        current_user.id,
        body.source_id,
        body.title
    )

    return session


@router.get("/sessions")
def get_chat_sessions(
        db: Session = Depends(
            get_db
        ),
        current_user=Depends(
            get_current_user
        )
):
    return db.query(
        ChatSession
    ).filter(
        ChatSession.user_id == current_user.id
    ).all()


@router.delete("/sessions/{session_id}")
def delete_chat_session(
        session_id: int,
        db: Session = Depends(
            get_db
        ),
        current_user=Depends(
            get_current_user
        )
):
    session = db.query(
        ChatSession
    ).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Chat session not found"
        )

    db.delete(session)
    db.commit()

    return {
        "success": True
    }
