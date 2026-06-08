from fastapi import APIRouter,HTTPException,Depends
from pydantic import BaseModel
import uuid
from app.services.limits.limits_service import check_repo_limit
from app.services.limits.usage_service import increment_repo_usage
from sqlalchemy.orm import Session
from app.models.usage_model import Usage
from app.models.user_model import User

from app.database.dependency import get_db
from app.middleware.auth_middleware import get_current_user


# repo_id = str(uuid.uuid4())

from app.services.loader.github_loader import (
    clone_repo
)

from app.services.github_service import (
    read_repo,
    prepare_repo_chunks
)

from app.services.embedding_service import (
    create_embedding
)

from app.services.qdrant_service import (
    create_collection,
    store_chunks_repo
)

router = APIRouter(
    prefix="/github",
    tags=["Github"]
)

class GithubRequest(BaseModel):
    repo_url:str
    
@router.post("/upload")
def upload_repo(
    body: GithubRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    repo_id = str(uuid.uuid4())
    
    usage = db.query(
        Usage
    ).filter(
        Usage.user_id == current_user.id
    ).first()
    
    print(usage)
    
    if not check_repo_limit(
        usage
    ):
        raise HTTPException(
            status_code=403,
            detail="Repository limit exceeded"
        )
    
    path = clone_repo(
        body.repo_url
    )
    
    
    
    docs = read_repo(path)
    
    chunks = prepare_repo_chunks(
        docs
    )
    
    texts = [
        c["chunk"]
        for c in chunks
    ]
    
    
    embeddings = create_embedding(
        texts
    )
    
    create_collection()

    store_chunks_repo(
        chunks=chunks,
        embeddings=embeddings,
        repo_id=repo_id
    )

    increment_repo_usage(
        db,
        current_user.id
    )
    
    print("docs:", len(docs))
    print("chunks:", len(chunks))
    print("embeddings:", len(embeddings))

    return {
        "repo_id":repo_id,
        "files":len(docs),
        "chunks":len(chunks)
    }
