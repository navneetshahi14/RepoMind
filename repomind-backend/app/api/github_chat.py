from fastapi import APIRouter,HTTPException,Depends
from pydantic import BaseModel

from app.services.retrieval_service import (retrieve_repo_chunks)
from sqlalchemy.orm import Session
from app.models.user_model import User  
from app.services.limits.limits_service import check_message_limit
from app.services.limits.usage_service import increment_message_usage
from app.models.usage_model import Usage

from app.database.dependency import get_db
from app.middleware.auth_middleware import get_current_user


from app.services.prompt_service import (build_repo_prompt)

from app.services.llm_service import (generate_answer)

from app.memory.session_store import (
    add_message, get_message
)

router = APIRouter(
    prefix="/github-chat",
    tags=["Github chat"]
)

class GithubChatRequest(BaseModel):
    repo_id:str
    question:str
    session_id:str
    

@router.post("/")
def github_chat(
    body:GithubChatRequest,
    db:Session = Depends(get_db),
    current_user:User = Depends(get_current_user)
):
    
    usage = db.query(
        Usage
    ).filter(
        Usage.user_id == current_user.id
    ).first()
    
    # print(usage)
    
    if not check_message_limit(usage):
        raise HTTPException(
            status_code=403,
            detail="Daily message limit exceeded"
        )
    
    results = retrieve_repo_chunks(
        body.question,
        body.repo_id
    )
    
    print(body)
    
    context_parts = []

    sources = []

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
        
        sources.append({
            "file":payload["file"],
            "path":payload["path"],
            "page":payload.get("page"),
            "score":round(hit.score,3)
        })
        
    context = "\n\n".join(
        context_parts
    )
    
    history = get_message(body.session_id)
    
    prompt = build_repo_prompt(
        body.question,
        context
    )
    
    print(prompt)
    
    answer = generate_answer(prompt)
    
    add_message(
        body.session_id,
        "user",
        body.question
    )
    
    add_message(
        body.session_id,
        "assistant",
        answer
    )
    increment_message_usage(
        db,current_user.id
    )

    return {
        "answer":answer,
        "source":sources,
        "history":history
    }