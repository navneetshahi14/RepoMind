from app.models.chunk_model import Chunk
from app.repositories.chunk_repository import (
    bulk_create_chunks
)

def save_chunk(
    db,
    source_id,
    file_node,
    chunk_texts
):
    chunks = []
    
    for index, chunk_text in enumerate(
        chunk_texts
    ):
        chunk = Chunk(
            source_id=source_id,
            file_node_id = file_node.id,
            chunk_index= index,
            content=chunk_text,
            token_count= len(
                chunk_text.split()
            )
        )
        
        chunks.append(chunk)

    bulk_create_chunks(
        db,chunks
    )
    
    return chunks