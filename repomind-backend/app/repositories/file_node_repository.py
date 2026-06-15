from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.file_node_model import FileNode

def create_file_node(
    db: Session,
    file_node: FileNode
):
    db.add(file_node)
    db.commit()
    db.refresh(file_node)

    return file_node


def bulk_create_file_nodes(
    db: Session,
    file_nodes: list[FileNode]
):
    db.bulk_save_objects(file_nodes)
    db.commit()


def get_source_file_nodes(
    db: Session,
    source_id
):
    return (
        db.query(FileNode)
        .filter(
            FileNode.source_id == source_id
        )
        .all()
    )
    
def get_file_node_by_path(
    db,
    source_id,
    path
):
    return (
        db.query(
            FileNode
        ).filter(
            FileNode.source_id == source_id,
            FileNode.path == path
        )
        .first()
    )
    
    
def get_file_node_by_folder(
    db,
    source_id,
    folder_path
):
    return (
        db.query(FileNode)
        .filter(
            FileNode.source_id == source_id,
            FileNode.path.startswith(folder_path)
        )
        .all()
    )


def get_project_file_nodes(
    db: Session,
    project_id
):
    """
    All FileNodes belonging to a project (joined through Source).
    Returns a list of (FileNode, source_type) tuples.
    """
    from app.models.source_model import Source
    return (
        db.query(FileNode)
        .join(Source, Source.id == FileNode.source_id)
        .filter(Source.project_id == project_id)
        .all()
    )
    
from app.models.source_model import Source

def count_project_files(
    db: Session,
    project_id
):
    return (
        db.query(func.count(FileNode.id))
        .join(Source)
        .filter(Source.project_id == project_id)
        .scalar()
    )