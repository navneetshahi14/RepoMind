from qdrant_client import QdrantClient
import uuid

from qdrant_client.models import (
    VectorParams,
    Distance,
    PointStruct
)

COLLECTION_NAME = "repomind"

client = QdrantClient(
    url="http://localhost:6333"
)


def create_collection():

    collections = client.get_collections()

    names = [
        c.name
        for c in collections.collections
    ]

    if COLLECTION_NAME not in names:

        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=384,
                distance=Distance.COSINE
            )
        )


def store_chunks(
    embeddings,
    chunks,
    filename,
    document_id
):

    points = []

    for embedding, chunk in zip(
        embeddings,
        chunks
    ):

        points.append(
            PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={
                    "text": chunk,
                    "filename": filename,
                    "document_id":document_id
                }
            )
        )

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points
    )
    
def store_chunks_repo(
    chunks,
    embeddings,
    repo_id
):
    points = []
    
    for chunks_data, embedding in zip(
        chunks,
        embeddings
    ):
        
        points.append(
            PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={
                    "text":chunks_data["chunk"],
                    "file":chunks_data["file"],
                    "path":chunks_data["path"],
                    "repo_id":repo_id,
                    "source_type":"github"
                }
            )
        )
        
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points
    )