from sqlalchemy.orm import Session
from app.repositories.file_node_repository import (
    get_source_file_nodes
)
from app.services.chunking_service import (
    read_file,
    split_into_chunks
)

from app.services.save_chunks_service import (
    save_chunk
)
from app.services.process_embeddings_service import (
    process_embeddings
)

def process_source(
    db:Session,
    source_id,
    repo_root_path:str
):
    file_nodes = get_source_file_nodes(
        db,source_id
    )
    
    print(
        "Total files:",
        len(file_nodes)
    )
    
    for node in file_nodes:
        absolute_file_path = (
            f"{repo_root_path}/{node.path}"
        )
        
        content = read_file(
            absolute_file_path
        )
        
        if not content:
            continue
        
        chunk_texts = split_into_chunks(
            content
        )
        
        save_chunk(
            db=db,
            source_id=source_id,
            file_node=node,
            chunk_texts=chunk_texts
        )
        
    process_embeddings(
        db,
        source_id
    )
        