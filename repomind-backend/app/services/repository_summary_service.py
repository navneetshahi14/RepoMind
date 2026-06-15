from sqlalchemy.orm import Session

from app.prompt.repository_summary_prompt import (
    REPO_SUMMARY_PROMPT
)

from app.services.search_service import (
    semantic_search
)

from app.providers.llm_provider import (
    generate_response
)


def generate_repository_summary(
    context: str
):

    return generate_response(
        system_prompt=REPO_SUMMARY_PROMPT,
        user_prompt=context
    )


def summarize_repository(
    db: Session
):

    chunks = semantic_search(
        db,
        question="What is this repository about?",
        top_k=20
    )

    context = "\n\n".join(
        chunk.content
        for chunk in chunks
    )

    summary = generate_repository_summary(
        context
    )

    return summary

