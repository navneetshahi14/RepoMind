from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.project_model import Project
from app.repositories.project_repository import (
    create_project,delete_project,get_project_by_id,get_projects_by_user
)
from app.schema.project_schema import (
    ProjectCreate, ProjectUpdate
)


def create_project_service(
    db:Session,
    user_id:UUID,
    payload:ProjectCreate
):
    project = Project(
        name=payload.name,
        description=payload.description,
        owner_id=user_id
    )
    
    return create_project(db,project)

def get_project_service(
    db:Session,
    project_id:UUID,
    user_id:UUID
):
    project = get_project_by_id(db,project_id)
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
        
    if project.owner_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
        
    return project

def get_user_projects_service(
    db:Session,
    user_id:UUID
):
    return get_projects_by_user(db,user_id)

def delete_project_service(
    db:Session,
    project_id:UUID,
    user_id:UUID
):
    project = get_project_by_id(db, project_id)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    if project.owner_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    delete_project(db, project)

    return {
        "message":"Project deleted successfully"
    }