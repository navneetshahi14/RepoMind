from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.repositories.file_node_repository import (
    get_file_node_by_path
)
from app.repositories.source_repository import get_project_sources

from app.repositories.chunk_repository import (
    get_chunks_by_file_node
)
from app.utils.llm_utils import (
    generate_file_explanation
)

def explain_file(
    db:Session,
    project_id,
    file_path:str
):
    sources = get_project_sources(
        db,
        project_id
    )

    file_node = None

    for source in sources:

        file_node = get_file_node_by_path(
            db,
            source.id,
            file_path
        )

        if file_node:
            break

    if not file_node:
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    chunks = get_chunks_by_file_node(
        db,
        file_node.id
    )

    context = "\n\n".join(
        chunk.content
        for chunk in chunks
    )

    return generate_file_explanation(
        context
    )