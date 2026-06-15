from uuid import UUID
from sqlalchemy.orm import Session

from app.models.project_model import Project


def create_project(
    db: Session,
    project: Project
):
    db.add(project)
    db.commit()
    db.refresh(project)

    return project


def get_project_by_id(
    db: Session,
    project_id: UUID
):
    return (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )


def get_projects_by_user(
    db: Session,
    user_id: UUID
):
    return (
        db.query(Project)
        .filter(Project.owner_id == user_id)
        .all()
    )


def delete_project(
    db: Session,
    project: Project
):
    db.delete(project)
    db.commit()