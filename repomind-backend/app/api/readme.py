from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.retrieval_service import get_repo_chunks
from app.services.prompt_service import build_readme_prompt
from app.services.llm_service import generate_answer

router = APIRouter(
    prefix="/github",
    tags=["README"]
)

legacy_router = APIRouter(
    prefix="/readme",
    tags=["README"]
)

class READMEREQUEST(BaseModel):
    repo_id: str
    projectName: str | None = None
    description: str | None = None
    tone: str | None = None
    includeInstallation: bool = True
    includeUsage: bool = True
    includeAPI: bool = True
    includeArchitecture: bool = False
    includeContributing: bool = True


def build_readme_response(body: READMEREQUEST):
    try:
        results = get_repo_chunks(
            repo_id=body.repo_id,
            limit=40
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Could not retrieve repository context: {exc}"
        )

    if not results:
        raise HTTPException(
            status_code=404,
            detail="No indexed chunks found for this repository. Re-index the repo and try again."
        )

    context = "\n\n".join(
        [
            hit.payload["text"]
            for hit in results
        ]
    )

    prompt = build_readme_prompt(
        context=context,
        project_name=body.projectName,
        description=body.description,
        tone=body.tone,
        include_installation=body.includeInstallation,
        include_usage=body.includeUsage,
        include_api=body.includeAPI,
        include_architecture=body.includeArchitecture,
        include_contributing=body.includeContributing
    )

    try:
        answer = generate_answer(prompt)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Could not generate README: {exc}"
        )

    return {
        "readme": answer,
        "content": answer
    }
    

@router.post("/readme")
def generate_readme(body:READMEREQUEST):
    return build_readme_response(body)


@legacy_router.post("/generate/{repo_id}")
def generate_readme_legacy(
    repo_id: str,
    body: READMEREQUEST | None = None
):
    request = body or READMEREQUEST(repo_id=repo_id)
    request.repo_id = repo_id
    return build_readme_response(request)
