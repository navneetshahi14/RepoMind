from sqlalchemy.orm import Session

from app.models.file_node_model import FileNode
from app.repositories.file_node_repository import (
    create_file_node
)
from app.services.chunking_service import (
    split_into_chunks
)
from app.services.pdf_service import (
    extract_pdf_text
)
from app.services.save_chunks_service import (
    save_chunk
)
from app.services.process_embeddings_service import (
    process_embeddings
)


def process_pdf(
    db: Session,
    source_id,
    pdf_path: str
):

    text = extract_pdf_text(
        pdf_path
    )

    if not text.strip():
        return

    file_node = FileNode(
        source_id=source_id,
        path=pdf_path,
        name=pdf_path.split("/")[-1],
        extension=".pdf"
    )

    file_node = create_file_node(
        db,
        file_node
    )

    chunk_texts = split_into_chunks(
        text
    )
    

    save_chunk(
        db=db,
        source_id=source_id,
        file_node=file_node,
        chunk_texts=chunk_texts
    )

    process_embeddings(
        db,
        source_id
    )