
from langchain_openai import OpenAIEmbeddings
from langchain_ollama import OllamaEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings

from app.core.config import settings


def get_embedding_model():

    if settings.EMBEDDING_PROVIDER == "openai":

        return OpenAIEmbeddings(
            model=settings.OPENAI_EMBEDDING_MODEL
        )

    elif settings.EMBEDDING_PROVIDER == "ollama":

        return OllamaEmbeddings(
            model=settings.OLLAMA_EMBEDDING_MODEL,
            base_url=settings.OLLAMA_BASE_URL
        )

    elif settings.EMBEDDING_PROVIDER == "huggingface":

        return HuggingFaceEmbeddings(
            model_name=settings.HUGGINGFACE_EMBEDDING_MODEL
        )

    raise ValueError(
        "Unsupported embedding provider"
    )


def generate_embedding(
    text: str
):

    embedding_model = get_embedding_model()

    return embedding_model.embed_query(
        text
    )
