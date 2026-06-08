from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.upload import router as upload_router
from app.api.chat import router as chat_router
from app.api.github import router as github_router
from app.api.github_chat import router as github_chat_router
from app.api.api_discovery import router as api_discovery_router
from app.api.architecture import router as architecture_router
from app.api.readme import router as readme_router
from app.api.readme import legacy_router as legacy_readme_router
from app.database.connection import engine
from app.database.base import Base
from app.models.user_model import User
from app.api.auth import (router as auth_router)
from app.api.user import router as user_router
from app.api.billing import router as billing_router
# from app.models.chat_model import ChatSession
from app.models.chat_session_model import ChatSession
from app.models.source_models import Source
from app.models.message_model import Message
from app.models.subscription_model import Subscription
from app.models.usage_model import Usage

app = FastAPI()

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

Base.metadata.create_all(
    bind=engine
)

app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(github_router)
app.include_router(github_chat_router)
app.include_router(api_discovery_router)
app.include_router(architecture_router)
app.include_router(readme_router)
app.include_router(legacy_readme_router)
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(billing_router)

@app.get("/")
def home():
    return {"message":"RepoMind Backend in running"}
