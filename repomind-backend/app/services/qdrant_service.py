from typing import Iterable, Optional

from qdrant_client import QdrantClient
from qdrant_client.models import (
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
    PointIdsList,
    Distance
)

qdrant_client = QdrantClient(
    url="http://localhost:6333"
)

def create_collection():
    
    if not qdrant_client.collection_exists(
        "repomind"
    ):
        qdrant_client.create_collection(
            collection_name="repomind",
            vectors_config=VectorParams(
                size=768,
                distance=Distance.COSINE
            )
        )
        


def upsert_vector(
    vector_id,
    embedding,
    payload
):
    qdrant_client.upsert(
        collection_name="repomind",
        points=[
            PointStruct(
                id=vector_id,
                vector=embedding,
                payload=payload
            )
        ]
    )


def upsert_vectors( points: list[PointStruct] ): 
    qdrant_client.upsert( collection_name="repomind", points=points )

def delete_vectors( source_id: list[str] ):
    
    qdrant_client.delete(
        collection_name="repomind",
        points_selector=Filter(
            must=[
                FieldCondition(
                    key="source_id",
                    match=MatchValue(
                        value=str(source_id)
                    )
                )
            ]
        )
    )

def search_vectors(
    embedding: list[float],
    limit: int = 5,
    project_id: Optional[str] = None,
    source_ids: Optional[Iterable[str]] = None,
):
    must = []
    if project_id is not None:
        must.append(
            FieldCondition(
                key="project_id",
                match=MatchValue(value=str(project_id)),
            )
        )
    if source_ids is not None:
        ids = list(source_ids)
        if ids:
            # Qdrant's MatchAny is the cleanest way; fall back to MatchValue
            # per id if the client version doesn't expose it.
            from qdrant_client.models import MatchAny
            must.append(
                FieldCondition(
                    key="source_id",
                    match=MatchAny(any=[str(s) for s in ids]),
                )
            )

    query_filter = Filter(must=must) if must else None

    results = qdrant_client.query_points(
        collection_name="repomind",
        query=embedding,
        query_filter=query_filter,
        limit=limit,
    )

    return results