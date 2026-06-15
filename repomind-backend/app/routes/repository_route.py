from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.dependencies.auth_dependency import get_current_user
from app.schema.analyzer_schema import (
    APIDiscoveryResponse,
    ArchitectureResponse,
    GeneratedReadmeResponse,
    ReadmeConfig,
)
from app.schema.explain_schema import (
    ExplainFileRequest,
    ExplainFolderRequest,
)
from app.services.api_discovery_service import discover_project_apis
from app.services.architecture_service import summarize_architecture
from app.services.explain_file_service import explain_file
from app.services.explain_folder_service import explain_folder
from app.services.readme_service import create_readme


router = APIRouter(
    prefix="/repo",
    tags=["Repository"]
)


def _ensure_owner(db: Session, project_id: UUID, user_id: UUID) -> None:

    from fastapi import HTTPException
    from app.repositories.project_repository import get_project_by_id

    project = get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")


# ---------------------------------------------------------------------------
# Project-scoped analyzers
# ---------------------------------------------------------------------------

@router.post(
    "/{project_id}/architecture-summary",
    response_model=ArchitectureResponse,
)
def architecture_summary(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _ensure_owner(db, project_id, current_user.id)
    architecture = summarize_architecture(db, project_id)
    return ArchitectureResponse(
        overview=architecture,
        explanation=architecture,
        diagram="",
    )


@router.post(
    "/{project_id}/api-discovery",
    response_model=APIDiscoveryResponse,
)
def api_discovery(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _ensure_owner(db, project_id, current_user.id)
    endpoints = discover_project_apis(db, project_id)
    return APIDiscoveryResponse(endpoints=endpoints)


@router.post(
    "/{project_id}/generate-readme",
    response_model=GeneratedReadmeResponse,
)
def generate_project_readme(
    project_id: UUID,
    config: ReadmeConfig | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _ensure_owner(db, project_id, current_user.id)
    content = create_readme(db, project_id, config)
    return GeneratedReadmeResponse(content=content)


@router.post("/{project_id}/explain-file")
def explain(
    project_id: UUID,
    payload: ExplainFileRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _ensure_owner(db, project_id, current_user.id)
    return {
        "explanation": explain_file(
            db,
            project_id=project_id,
            file_path=payload.file_path,
        )
    }


@router.post(
    "/{project_id}/explain-folder"
)
def explain_project_folder(
    project_id: UUID,
    payload: ExplainFolderRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _ensure_owner(db, project_id, current_user.id)
    explanation = explain_folder(
        db,
        project_id,
        payload.folder_path,
    )
    return {
        "explanation": explanation
    }
