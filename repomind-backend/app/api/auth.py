from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependency import get_db

from app.schema.register_schema import (
    RegisterRequest
)

from app.schema.login_schema import (
    LoginRequest
)

from app.middleware.auth_middleware import (
    get_current_user
)

from app.models.user_model import User

from app.services.auth.auth_service import (
    register_user,
    login_user
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

def serialize_user(user: User):
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email
    }


@router.post("/register")
def register(
    body:RegisterRequest,
    db: Session = Depends(get_db)
):
    user, token = register_user(
        db, body.name,body.email, body.password
    )
    
    return {
        "message":"User created",
        "user_id":user.id,
        "accessToken": token,
        "access_token": token,
        "user": serialize_user(user)
    }


@router.post("/signup")
def signup(
    body:RegisterRequest,
    db: Session = Depends(get_db)
):
    return register(body, db)
    
@router.post("/login")
def login(
    body: LoginRequest,
    db: Session = Depends(get_db)
):
    token = login_user(
        db,
        body.email,
        body.password
    )

    user = db.query(
        User
    ).filter(
        User.email == body.email
    ).first()
    
    return {
        "access_token":token,
        "accessToken":token,
        "user": serialize_user(user)
    }
    
    
@router.get("/me")
def get_me(
    current_user: User = Depends(
        get_current_user
    )
):
    return {
        "id":str(current_user.id),
        "name":current_user.name,
        "email":current_user.email
    }
