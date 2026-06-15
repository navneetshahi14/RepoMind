from sqlalchemy.orm import Session
from app.models.citation_model import Citation

def bulk_create_citation(
    db:Session,
    citations:list[Citation]
):
    db.bulk_save_objects(
        citations
    )
    
    db.commit()