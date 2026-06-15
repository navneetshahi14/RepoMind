from langchain_core.messages import (
    HumanMessage,
    SystemMessage,
    AIMessage
)

from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI

from app.core.config import settings


def get_llm():

    print(settings.LLM_PROVIDER)
    if settings.LLM_PROVIDER == "ollama":

        return ChatOllama(
            model=settings.OLLAMA_MODEL,
            base_url=settings.OLLAMA_BASE_URL
        )

    elif settings.LLM_PROVIDER == "openai":

        return ChatOpenAI(
            model=settings.OPENAI_MODEL
        )

    elif settings.LLM_PROVIDER == "gemini":

        return ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL
        )

    raise ValueError(
        "Unsupported LLM provider"
    )


def generate_response(
        system_prompt: str,
        user_prompt: str
):

    llm = get_llm()

    messages = [
        SystemMessage(
            content=system_prompt
        ),
        HumanMessage(
            content=user_prompt
        )
    ]

    response = llm.invoke(
        messages
    )

    return response.content


def stream_response(
        system_prompt: str,
        user_prompt: str
):

    llm = get_llm()

    messages = [
        SystemMessage(
            content=system_prompt
        ),
        HumanMessage(
            content=user_prompt
        )
    ]

    for chunk in llm.stream(
            messages
    ):

        if chunk.content:
            yield chunk.content