from fastapi import APIRouter
from pydantic import BaseModel

from app.services.retrieval_service import retrieve_repo_chunks
from app.services.analyzer.api_analyzers import find_api

router = APIRouter(
    prefix="/github",
    tags=["API Discovery"]
)

class APIRequest(BaseModel):
    repo_id:str
    
@router.post("/apis")
def discover_apis(body:APIRequest):
    results = retrieve_repo_chunks(
        "List APIs",
        body.repo_id,
        limit=30
    )
    
    apis = []
    
    
    for hit in results:
        payload = hit.payload
        
        found = find_api(
            payload["text"]
        )
        
        if found:
            apis.append(
                {
                    "file":payload["file"],
                    "apis":found
                }
            )
            
    return {
        "apis":apis
    }