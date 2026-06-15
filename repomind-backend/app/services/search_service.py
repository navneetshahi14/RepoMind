from typing import Iterable, Optional
from uuid import UUID

from sqlalchemy.orm import Session
from app.repositories.chunk_repository import (
    get_chunk_by_id
)
from app.services.embedding_service import (
    generate_embedding
)
from app.services.qdrant_service import (
    search_vectors
)

def semantic_search(
    db: Session,
    question: str,
    top_k: int = 5,
    project_id: Optional[UUID] = None,
    source_ids: Optional[Iterable[UUID]] = None,
):
    query_embedding = generate_embedding(
        question
    )

    results = search_vectors(
        query_embedding,
        top_k,
        project_id=str(project_id) if project_id else None,
        source_ids=[str(s) for s in source_ids] if source_ids else None,
    )

    chunks = []


    scored_points = getattr(results, "points", None)
    if scored_points is None:
        scored_points = list(results) if results is not None else []

    for sp in scored_points:
        payload = getattr(sp, "payload", None) or {}
        chunk_id = payload.get("chunk_id")
        if not chunk_id:
            continue
        chunk = get_chunk_by_id(db, chunk_id)
        if chunk:
            chunks.append(chunk)

    return chunks