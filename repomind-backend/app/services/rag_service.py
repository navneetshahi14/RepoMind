from sqlalchemy.orm import Session
from app.services.search_service import (
    semantic_search
)

from app.providers.llm_provider import(
    generate_response,
    stream_response
)

SYSTEM_PROMPT = """
You are Repo Mind AI.

Answer questions only from the repository context provided.

If the answer is not present in the context, say:

'I could not find this information in the repository.'

Be concise and accurate.
"""

def build_context(
    chunks
)->str:
    context_parts = []
    
    for chunk in chunks:
        
        section = f"""
        FILE PATH:
        {chunk.file_node.path}
        
        CONTENT:
        {chunk.content}
        """
        
        context_parts.append(
            section
        )
        
    return "\n\n".join(
        context_parts
    )

def generate_answer(
    context: str,
    question: str
) -> str:

    user_prompt = f"""
    Repository Context:

{context}

Question:

{question}
    """

    return generate_response(
        system_prompt=SYSTEM_PROMPT,
        user_prompt=user_prompt
    )


def ask_repository(
    db: Session,
    question: str,
    top_k: int = 5
):

    chunks = semantic_search(
        db,
        question,
        top_k
    )

    context = build_context(
        chunks
    )

    answer = generate_answer(
        context,
        question
    )

    sources = []

    for chunk in chunks:

        sources.append(
            chunk.file_node.path
        )

    return {
        "question": question,
        "answer": answer,
        "sources": list(
            set(sources)
        )
    }
    
def stream_answer(
    context: str,
    question: str
):
    user_prompt = f"""
    Repository Context:
                
    {context}
                
    Question:
                
    {question} 
    """
    
    
    
    return stream_response(
        system_prompt=SYSTEM_PROMPT,
        user_prompt=user_prompt
    )