from uuid import UUID
from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    Query,
    UploadFile,
    File
)
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.dependencies.auth_dependency import get_current_user
from app.schema.source_schema import (
    SourceCreate,
    SourceResponse
)
from app.services.source_service import (
    create_source_service,
    delete_source_service,
    get_project_sources_service,
)
from app.services.github_service import (
    connect_github_repository,
)
from app.services.upload_pdf_service import (
    upload_pdf
)

router = APIRouter(
    prefix="/sources",
    tags=["Sources"]
)


class ConnectGithubRequest(BaseModel):
    repo_url: str


@router.post(
    "/",
    response_model=SourceResponse
)
def create_source(
    payload: SourceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return create_source_service(
        db,
        payload,
        current_user.id,
    )


@router.get(
    "/project/{project_id}",
    response_model=list[SourceResponse]
)
def get_project_sources(
    project_id: UUID,
    source_type: Optional[str] = Query(
        None,
        alias="type",
        description="Filter by source type (PDF, GITHUB, ...).",
    ),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_project_sources_service(
        db,
        project_id,
        current_user.id,
        source_type=source_type,
    )


@router.post(
    "/upload/pdf"
)
async def upload_pdf_route(
    project_id: UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Project ownership check before doing any work.
    from app.services.source_service import _ensure_owner
    _ensure_owner(db, project_id, current_user.id)

    source = await upload_pdf(
        db=db,
        project_id=project_id,
        file=file,
    )

    return {
        "source_id": source.id,
        "status": source.status,
        "file_name": source.file_name,
    }


@router.post(
    "/connect/github",
    response_model=SourceResponse
)
def connect_github(
    project_id: UUID,
    payload: ConnectGithubRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    source = connect_github_repository(
        db=db,
        project_id=project_id,
        user_id=current_user.id,
        repo_url=payload.repo_url,
    )
    return source


@router.delete(
    "/{source_id}",
    status_code=204
)
def delete_source(
    source_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Delete a single Source (PDF or GitHub). Cascades through
    FileNode / Chunk / Citation so Qdrant + Postgres stay in sync.
    """
    delete_source_service(db, source_id, current_user.id)
    return None