from sqlalchemy.orm import Session

from app.services.search_service import (
    semantic_search
)
from app.utils.llm_utils import (
    generate_architecture_summary
)


def summarize_architecture(
        db: Session,
        project_id,
):
    """
    Architecture summary for a single project. The semantic search is
    scoped by `project_id` so the LLM only sees chunks from the
    targeted project's sources.
    """
    chunks = semantic_search(
        db=db,
        question="""
Describe the architecture,
folder structure,
modules and flow
of this repository.
""",
        top_k=30,
        project_id=project_id,
    )

    context = "\n\n".join(
        chunk.content
        for chunk in chunks
    )

    return generate_architecture_summary(
        context
    )