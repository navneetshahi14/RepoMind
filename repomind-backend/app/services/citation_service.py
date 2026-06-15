from app.models.citation_model import Citation
from app.repositories.citation_repository import (
    bulk_create_citation
)
from uuid import UUID
from sqlalchemy.orm import Session

def save_citations(
    db:Session,
    message_id:UUID,
    chunks
):
    citations = []
    
    for chunk in chunks:
        
        citation = Citation(
            message_id=message_id,
            chunk_id=chunk.id,
            file_path=chunk.file_node.path
        )
        
        citations.append(
            citation
        )
    
    bulk_create_citation(
        db,
        citations
    )
    
    