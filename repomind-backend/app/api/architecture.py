from fastapi import APIRouter
from pydantic import BaseModel

from app.services.retrieval_service import retrieve_repo_chunks
from app.services.prompt_service import build_architecture_prompt
from app.services.llm_service import generate_answer

router = APIRouter(
    prefix="/github",
    tags=["Architecture"]
)

class ArchitectureRequest(BaseModel):
    repo_id:str
    
@router.post("/architecture")
def explain_architecture(body:ArchitectureRequest):
    results = retrieve_repo_chunks(
        "Explain Architecture",
        body.repo_id
    )
    
    context = "\n\n".join([
        hit.payload["text"]
        for hit in results
    ])
    
    prompt = build_architecture_prompt(
        context
    )
    
    answer = generate_answer(
        prompt
    )
    
    return {
        "architecture":answer
    }
