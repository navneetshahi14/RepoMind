from app.services.embedding_service import get_embedding_model


def generate_embeddings(
    texts: list[str]
):

    embedding_model = get_embedding_model()

    return embedding_model.embed_documents(
        texts
    )
