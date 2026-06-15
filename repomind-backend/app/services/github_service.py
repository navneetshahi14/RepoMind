from sqlalchemy.orm import Session

from app.models.source_model import Source
from app.services.file_tree_service import (
    build_file_tree
)
from app.services.save_file_nodes_service import (
    save_file_nodes
)
from app.utils.git_utils import (
    clone_repository
)

from app.services.process_source_service import (
    process_source
)
from app.services.source_service import _ensure_owner

CLONE_DIR = "repositories"

def ingest_github_repository(
    db:Session,
    source_id,
    github_url: str
) -> str:
    repo_path = clone_repository(
        github_url,
        CLONE_DIR
    )

    files = build_file_tree(
        repo_path
    )

    save_file_nodes(
        db,
        source_id,
        files
    )

    process_source(
        db=db,source_id=source_id,repo_root_path=repo_path
    )

    return files

from app.models.chunk_model import Chunk
from app.models.file_node_model import FileNode 

def connect_github_repository(
    db: Session,
    project_id,
    user_id,
    repo_url: str,
):
    _ensure_owner(db, project_id, user_id)

    source = Source(
        project_id=project_id,
        type="GITHUB",
        source_url=repo_url,
        file_name=None,
        status="PROCESSING",
    )
    
    db.add(source)
    db.commit()
    db.refresh(source)

    try:
        ingest_github_repository(db, source.id, repo_url)
        source.status = "COMPLETED"
    except Exception as exc:  # noqa: BLE001 — we want to capture *all* errors
        print("error")
        source.status = "FAILED"
        source.error_message = str(exc)[:1000]

    total_chunks = (
        db.query(Chunk)
        .filter(
            Chunk.source_id == source.id
        )
        .count()
    )
    
    total_files = (
        db.query(FileNode)
        .filter(
            FileNode.source_id == source.id
        )
        .count()
    )

    db.commit()
    db.refresh(source)
    
    response = {
        "id": source.id,
        "type": source.type,
        "project_id": source.project_id,
        "source_url": source.source_url,
        "file_name": source.file_name,
        "status": source.status,
        "error_message": source.error_message,
        "chunks": total_chunks,
        "files": total_files,
        "createdAt": source.created_at,
        "updatedAt": source.updated_at,
    }
    return response

