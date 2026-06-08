import os
import uuid
from pypdf import PdfReader


from app.services.chunking_service import (
    chunk_text
)

from app.services.embedding_service import (
    create_embedding
)

from app.services.qdrant_service import (
    create_collection,
    store_chunks
)

UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


async def process_pdf(file):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(
        file_path,
        "wb"
    ) as f:

        f.write(
            await file.read()
        )

    reader = PdfReader(
        file_path
    )

    text = ""
    document_id = str(uuid.uuid4())
    
    

    for page in reader.pages:

        page_text = page.extract_text()

        if page_text:

            text += page_text

    chunks = chunk_text(text)

    embeddings = [
        create_embedding(chunk)
        for chunk in chunks
    ]

    create_collection()
    
    payload = {
        "document_id":document_id,
        "filename":file.filename,
        "text":chunks
    }

    store_chunks(
        embeddings,
        chunks,
        file.filename,
        document_id
    )

    return {
        "document_id": document_id,
        "filename": file.filename,
        "chunks": len(chunks)
    }