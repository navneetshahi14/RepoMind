from fastapi import HTTPException

from app.repositories.source_repository import (
    get_project_sources
)
from app.repositories.file_node_repository import (
    get_file_node_by_folder
)
from app.repositories.chunk_repository import (
    get_chunks_by_file_nodes
)
from app.utils.llm_utils import (
    generate_folder_explanation
)


def explain_folder(
    db,
    project_id,
    folder_path
):

    sources = get_project_sources(
        db,
        project_id
    )

    file_nodes = []

    for source in sources:

        file_nodes.extend(
            get_file_node_by_folder(
                db,
                source.id,
                folder_path
            )
        )

    if not file_nodes:
        raise HTTPException(
            status_code=404,
            detail="Folder not found"
        )

    file_node_ids = [
        node.id
        for node in file_nodes
    ]

    chunks = get_chunks_by_file_nodes(
        db,
        file_node_ids
    )

    context = "\n\n".join(
        chunk.content
        for chunk in chunks
    )

    return generate_folder_explanation(
        context
    )