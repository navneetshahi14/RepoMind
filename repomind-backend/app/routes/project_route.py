from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.dependencies.auth_dependency import get_current_user
from app.schema.project_schema import (
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate
)
from app.schema.source_schema import SourceResponse
from app.services.project_service import (
    create_project_service,
    delete_project_service,
    get_project_service,
    get_user_projects_service,
)
from app.services.source_service import get_project_sources_service

router = APIRouter(
    prefix="/project",
    tags=["Project"]
)

@router.post(
    "/",
    response_model=ProjectResponse
)
def create_project(
    payload:ProjectCreate,
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return create_project_service(
        db,
        current_user.id,
        payload
    )

@router.get("/",response_model=list[ProjectResponse])
def get_projects(
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return get_user_projects_service(
        db,current_user.id
    )

@router.get(
    "/{project_id}",
    response_model=ProjectResponse
)
def get_project(
    project_id: UUID,
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return get_project_service(
        db,
        project_id,
        current_user.id
    )

@router.get(
    "/{project_id}/sources",
    response_model=list[SourceResponse]
)
def get_project_sources_for_project(
    project_id: UUID,
    source_type: Optional[str] = Query(
        None,
        alias="type",
        description="Filter by source type (PDF, GITHUB, ...).",
    ),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    return get_project_sources_service(
        db,
        project_id,
        current_user.id,
        source_type=source_type,
    )

@router.delete("/{project_id}")
def delete_project(
    project_id:UUID,
    db:Session = Depends(get_db),
    current_user  = Depends(get_current_user)
):
    return delete_project_service(
        db,
        project_id,
        current_user.id
    )