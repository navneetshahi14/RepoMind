from uuid import UUID

from sqlalchemy.orm import Session
from app.models.file_node_model import FileNode
from app.repositories.file_node_repository import (
    bulk_create_file_nodes
)

def save_file_nodes(
    db:Session,
    source_id:UUID,
    files: list[dict]
):
    file_nodes = []
    for file in files:
        file_node = FileNode(
            source_id = source_id,
            path = file["path"],
            name=file["name"],
            extension=file["extension"],
            size=file["size"]
        )
        
        file_nodes.append(
            file_node
        )
        
    bulk_create_file_nodes(
        db,file_nodes
    )