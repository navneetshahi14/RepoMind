from sqlalchemy.orm import Session
from app.services.search_service import semantic_search
from app.utils.llm_utils import generate_readme
from app.schema.analyzer_schema import ReadmeConfig


def create_readme(
    db: Session,
    project_id,
    config: ReadmeConfig | None = None,
):
    print(project_id)
    cfg = config or ReadmeConfig()

    chunks = semantic_search(
        db,
        question="Describe this repository and its features",
        top_k=30,
        project_id=project_id,
    )
    
    
    print("Chunks found:", len(chunks))


    context = "\n\n".join(
        chunk.content
        for chunk in chunks
    )
    
    print("context found:", len(context))

    # Build a project-scoped prompt that respects user config.
    sections = ["Project Title", "Description", "Features", "Tech Stack"]
    if cfg.include_installation:
        sections.append("Installation")
    if cfg.include_usage:
        sections.append("Usage")
    if cfg.include_architecture:
        sections.append("Architecture")
    if cfg.include_api:
        sections.append("API Section (if applicable)")
    if cfg.include_contributing:
        sections.append("Contributing")

    section_list = "\n".join(f"{i+1}. {s}" for i, s in enumerate(sections))
    header = (
        f"Project name: {cfg.project_name or 'this project'}\n"
        f"Brief description: {cfg.description or '(none provided)'}\n"
        f"Tone: {cfg.tone}\n"
    )

    prompt = (
        "Generate a professional GitHub README.md.\n\n"
        f"Context about the project:\n{header}\n\n"
        "Include the following sections (in this order):\n"
        f"{section_list}\n\n"
        "Return markdown only — no preamble, no explanation."
    )
    print(prompt)

    return generate_readme(context, custom_prompt=prompt)
    
    