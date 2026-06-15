from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)

from app.models.user_model import User
from app.repositories.user_repository import (
    get_user_by_email,
    get_user_by_username,
    create_user
)

from app.schema.auth_schema import (
    RegisterRequest,
    LoginRequest
)

def register_user(
    db:Session,
    payload:RegisterRequest
):
    if get_user_by_email(db, payload.email):
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    if get_user_by_username(
        db, payload.name
    ):
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    user = User(
        name = payload.name,
        email = payload.email,
        hashed_password = hash_password(
            payload.password
        ),
        full_name = payload.full_name
    )

    user = create_user(db,user)

    token = create_access_token(
        {
            "sub": str(user.id)
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

def login_user(
    db:Session,
    payload:LoginRequest
):
    user = get_user_by_email(
        db,
        payload.email
    )
    
    if (
        not user or
        not verify_password(
            payload.password,
            user.hashed_password
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Credentials"
        )
        
    token = create_access_token(
        {
            "sub":str(user.id)
        }
    )
    
    return {
        "access_token":token,
        "token_type":"bearer"
    }