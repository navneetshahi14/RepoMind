from qdrant_client.models import PointStruct
from app.models.source_model import Source
from app.models.embedding_model import Embedding
from app.repositories.chunk_repository import get_chunks_by_source
from app.providers.embedding_provider import (generate_embeddings)
from app.repositories.embedding_repository import (bulk_create_embeddings)
from app.core.config import settings
from app.services.qdrant_service import upsert_vectors

import time


BATCH_SIZE = 50


def chunk_list(
    items,
    batch_size
):

    for i in range(
        0,
        len(items),
        batch_size
    ):

        yield items[
            i:i+batch_size
        ]


def process_embeddings(
    db,
    source_id
):

    source = (
        db.query(Source)
        .filter(
            Source.id == source_id
        )
        .first()
    )

    project_id = (
        str(source.project_id)
        if source
        else None
    )

    chunks = get_chunks_by_source(
        db,
        source_id
    )
    
    total_chunks = len(chunks)
    total_batches = (
        total_chunks + BATCH_SIZE -1
    ) // BATCH_SIZE
    
    print(
    f"""
====================
TOTAL CHUNKS : {total_chunks}
BATCH SIZE   : {BATCH_SIZE}
TOTAL BATCHES: {total_batches}
====================
"""
)

    for batch in chunk_list(
        chunks,
        BATCH_SIZE
    ):

        texts = [
            chunk.content
            for chunk in batch
        ]

        start = time.time()

        vectors = generate_embeddings(
            texts
        )
        
        print(
            f"Embedding batch took {time.time()-start:.2f}s"
        )

        points = []

        embeddings = []

        for chunk, vector in zip(
            batch,
            vectors
        ):

            vector_id = str(
                chunk.id
            )

            points.append(
                PointStruct(
                    id=vector_id,
                    vector=vector,
                    payload={
                        "chunk_id": str(chunk.id),
                        "file_node_id": str(chunk.file_node_id),
                        "source_id": str(source_id),
                        "project_id": project_id
                    }
                )
            )

            embeddings.append(
                Embedding(
                    vector_id=vector_id,
                    provider=settings.EMBEDDING_PROVIDER,
                    model=(
                        settings.OPENAI_EMBEDDING_MODEL
                        if settings.EMBEDDING_PROVIDER == "openai"
                        else settings.OLLAMA_EMBEDDING_MODEL
                    ),
                    dimension=768
                )
            )

        upsert_vectors(
            points
        )

        bulk_create_embeddings(
            db,
            embeddings
        )

        print(
            f"Processed batch of {len(batch)} chunks"
        )
