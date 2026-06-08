from sentence_transformers import (
    SentenceTransformer
)

model = None


def get_model():
    global model

    if model is None:
        model = SentenceTransformer(
            "BAAI/bge-small-en-v1.5"
        )

    return model


def create_embedding(text: str):

    embedding = get_model().encode(
        text,
        normalize_embeddings=True
    )

    return embedding.tolist()
