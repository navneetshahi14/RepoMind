from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.source_model import Source
from app.repositories.project_repository import get_project_by_id
from app.repositories.source_repository import (
    create_source,
    delete_source,
    get_project_sources,
    get_source_by_id,
)
from app.schema.source_schema import SourceCreate


def _ensure_owner(db: Session, project_id: UUID, user_id: UUID) -> None:
    project = get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )
    if project.owner_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )


def create_source_service(
    db: Session,
    payload: SourceCreate,
    user_id: UUID,
):
    _ensure_owner(db, payload.project_id, user_id)

    source = Source(
        project_id=payload.project_id,
        type=payload.type,
        source_url=payload.source_url,
        file_name=payload.file_url,
        status="PENDING",
    )

    return create_source(db, source)

from app.repositories.chunk_repository import count_project_chunks,Chunk
from app.repositories.file_node_repository import count_project_files,FileNode

def get_project_sources_service(
    db: Session,
    project_id: UUID,
    user_id: UUID,
    source_type: str | None = None,
):
    _ensure_owner(db, project_id, user_id)

    sources = get_project_sources(db, project_id)
    
    if source_type:
        wanted = source_type.upper()
        sources = [
            s
            for s in sources
            if (s.type or "").upper() == wanted
        ]
        
    response = []

    for source in sources:

        total_chunks = (
            db.query(Chunk)
            .filter(
                Chunk.source_id == source.id
            )
            .count()
        )

        total_files = (
            db.query(FileNode)
            .filter(
                FileNode.source_id == source.id
            )
            .count()
        )

        response.append(
            {
                "id": source.id,
                "type": source.type,
                "project_id":source.project_id,
                "source_url": source.source_url,
                "file_name": source.file_name,
                "status": source.status,
                "error_message": source.error_message,
                "chunks": total_chunks,
                "files": total_files,
                "createdAt": source.created_at,
                "updatedAt": source.updated_at,
            }
        )

    return response

    # total_chunks = count_project_chunks(
    #     db,
    #     project_id
    # )

    # total_files = count_project_files(
    #     db,
    #     project_id
    # )
    
    # print(total_chunks)
    # print(total_files)

    # return sources

from app.services.qdrant_service import delete_vectors

def delete_source_service(
    db: Session,
    source_id: UUID,
    user_id: UUID,
):
    source = get_source_by_id(
        db,
        source_id
    )

    if not source:
        raise HTTPException(
            status_code=404,
            detail="Source not found"
        )

    _ensure_owner(
        db,
        source.project_id,
        user_id
    )

    delete_vectors(
        str(source.id)
    )

    delete_source(
        db,
        source
    )

    return None
