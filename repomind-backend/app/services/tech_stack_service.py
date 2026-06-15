from sqlalchemy.orm import Session
from app.services.search_service import (
    semantic_search
)
from app.utils.llm_utils import detect_tech_stack

def analyze_tech_stack(
    db:Session
):
    chunks = semantic_search(
        db,
        question="What technologies are used in this repository?",
        top_k=20
    )
    
    context = "\n\n".join(
        chunk.content
        for chunk in chunks
    )
    
    return detect_tech_stack(
        context
    )