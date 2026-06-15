from uuid import UUID
from sqlalchemy.orm import Session

from app.models.source_model import Source


def create_source(
    db: Session,
    source: Source
):
    db.add(source)
    db.commit()
    db.refresh(source)

    return source


def get_source_by_id(
    db: Session,
    source_id: UUID
):
    return (
        db.query(Source)
        .filter(Source.id == source_id)
        .first()
    )


def get_project_sources(
    db: Session,
    project_id: UUID
):
    return (
        db.query(Source)
        .filter(Source.project_id == project_id)
        .all()
    )
  
  
def update_source(
    db: Session,
    source: Source
):
    db.commit()
    db.refresh(source)

    return source


def delete_source(
    db: Session,
    source: Source
):
    db.delete(source)
    db.commit()