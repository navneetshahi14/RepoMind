from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.dependencies.auth_dependency import (
    get_current_user
)
from app.schema.auth_schema import (
    RegisterRequest,
    LoginRequest,
    TokenResponse
)
from app.schema.user_schema import (
    UserResponse
)
from app.services.auth_services import (
    register_user,
    login_user
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=TokenResponse
)
def register(
    payload: RegisterRequest,
    db: Session = Depends(get_db)
):
    return register_user(
        db,
        payload
    )


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db)
):
    return login_user(
        db,
        payload
    )


@router.get(
    "/me",
    response_model=UserResponse
)
def me(
    current_user=Depends(
        get_current_user
    )
):
    return current_user