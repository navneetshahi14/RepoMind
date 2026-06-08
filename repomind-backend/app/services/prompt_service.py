def prompt_builder(question,context):
    return f"""
You are an expert AI assistant.

Answer ONLY from provided context.

Context:
{context}

Question:
{question}

Answer:
"""


def build_repo_prompt(
    question,context
):
    return f"""
You are a senior software engineer.

Analyze the repository context and answer accurately.


Repositry Context:

{context}

Question:

{question}


Rules:
1. Mention filenames when possible.
2. Explain code flow.
3. Be concise.
4. If information is missing, say so.

Answer:
"""


def build_readme_prompt(
    context,
    project_name=None,
    description=None,
    tone=None,
    include_installation=True,
    include_usage=True,
    include_api=True,
    include_architecture=False,
    include_contributing=True
):
    sections = ["Overview", "Features"]

    if include_installation:
        sections.append("Installation")

    if include_usage:
        sections.append("Usage")

    if include_api:
        sections.append("API")

    if include_architecture:
        sections.append("Architecture")

    if include_contributing:
        sections.append("Contributing")

    return f"""
    Generate a {tone or "professional"} README.

    Project name:
    {project_name or "Infer from context"}

    Description:
    {description or "Infer from context"}
    
    Context:
    
    {context}

    Include:
    
    {chr(10).join(f"- {section}" for section in sections)}
"""

def build_architecture_prompt(context):
    return f"""
    Explain repository architecture.
    
    Context:
    {context}
    
    Explain:
    
    - Frontend
    - Backend
    - Database
    - Authentication
    - External Services
"""
