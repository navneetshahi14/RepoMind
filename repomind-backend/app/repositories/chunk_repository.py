from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.chunk_model import Chunk
from uuid import UUID

def bulk_create_chunks(
    db:Session,
    chunks: list[Chunk]
):
    db.bulk_save_objects(chunks)
    db.commit()
    
def get_chunks_by_source(
    db: Session,
    source_id:UUID
):
    return (
        db.query(Chunk)
        .filter(
            Chunk.source_id == source_id
        )
        .all()
    )
    
def update_chunk_embedding(
    db:Session,
    chunk:Chunk
):
    db.commit()
    db.refresh(chunk)

    return chunk

def get_chunk_by_id(
    db:Session,
    chunk_id:UUID
):
    return (
        db.query(Chunk)
        .filter(
            Chunk.id == chunk_id
        ).first()
    )
    
def get_chunks_by_file_node(
    db:Session,
    file_node_id
):
    return (
        db.query(
            Chunk
        ).filter(
            Chunk.file_node_id == file_node_id
        ).order_by(
            Chunk.chunk_index
        ).all()
    )
    
def get_chunks_by_file_nodes(
    db:Session,
    file_node_ids
):
    return (
        db.query(Chunk)
        .filter(
            Chunk.file_node_id.in_(file_node_ids)
        )
        .order_by(
            Chunk.file_node_id,
            Chunk.chunk_index
        )
        .all()
    )
    
from app.models.source_model import Source

def count_project_chunks(
    db: Session,
    project_id
):
    return (
        db.query(func.count(Chunk.id))
        .join(Source)
        .filter(Source.project_id == project_id)
        .scalar()
    )