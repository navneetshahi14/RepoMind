from sqlalchemy.orm import Session
from app.models.embedding_model import Embedding

def create_embedding(
    db:Session,
    embedding:Embedding
):
    db.add(embedding)
    db.commit()
    db.refresh(embedding)
    
    return embedding

def bulk_create_embeddings(
    db:Session,
    embeddings:list[Embedding]
):
    db.add_all(
        embeddings
    )
    
    db.commit()
    return embeddings