from app.services.embedding_service import (
    create_embedding
)

from app.services.qdrant_service import (
    client,
    COLLECTION_NAME
)

from qdrant_client.models import Filter
from qdrant_client.models import FieldCondition
from qdrant_client.models import MatchValue

def retrieval_chunks(
    query:str,
    document_id,
    limit:int = 5
):
    query_embedding = create_embedding(
        query
    )
    
    # print(dir(client))
    
    result = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_embedding,
        limit=5,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="document_id",
                    match=MatchValue(
                        value=document_id
                    )
                )
            ]
        )
    )
    
    return result.points


def retrieve_repo_chunks(
    question:str,
    repo_id: str,
    limit:int = 8
):
    query_embedding = create_embedding(
        question
    )
    
    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_embedding,
        limit=limit,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="repo_id",
                    match=MatchValue(
                        value=repo_id
                    )
                )
            ]
        )
    )
    
    return results.points


def get_repo_chunks(
    repo_id: str,
    limit: int = 30
):
    results, _ = client.scroll(
        collection_name=COLLECTION_NAME,
        scroll_filter=Filter(
            must=[
                FieldCondition(
                    key="repo_id",
                    match=MatchValue(
                        value=repo_id
                    )
                )
            ]
        ),
        limit=limit,
        with_payload=True,
        with_vectors=False
    )

    return results
