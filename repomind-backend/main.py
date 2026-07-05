from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.base import Base
from app.models import (  # noqa: F401  (registers ORM models with Base.metadata)
    User,
    Project,
    Source,
    FileNode,
    Embedding,
    Chunk,
    ChatSession,
    Message,
    Citation,
    ProcessingJob,
)
from app.database.connection import engine
from app.services.qdrant_service import create_collection

from app.routes.auth_route import router as auth_router
from app.routes.project_route import router as project_router
from app.routes.source_route import router as source_router
from app.routes.chat_session_route import router as chat_session_router
from app.routes.message_route import router as message_router
from app.routes.repository_route import router as repository_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables (Alembic initial migration is empty pass/pass for now).
    Base.metadata.create_all(bind=engine)
    # Ensure the Qdrant collection exists before any embed/upsert.
    try:
        create_collection()
    except Exception:
        # Qdrant may not be reachable in local dev; don't crash boot.
        pass
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(project_router)
app.include_router(source_router)
app.include_router(chat_session_router)
app.include_router(message_router)
app.include_router(repository_router)


@app.get("/")
def home():
    return {
        "message": "Repo Mind Backend is running"
    }
