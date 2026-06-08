from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.dependency import get_db
from app.middleware.auth_middleware import (
    get_current_user
)

from app.models.user_model import User

from app.schema.update_user_schema import (
    UpdateUserRequest
)

from app.services.user_service import (
    update_user_profile
)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me")
def get_profile(
    current_user: User = Depends(
        get_current_user
    )
):
    return current_user

@router.patch("/profile")
def update_profile( 
    body: UpdateUserRequest,
    db: Session = Depends(
        get_db
    ),
    current_user: User = Depends(
        get_current_user
    )
):
    
    user = update_user_profile(
        db,
        current_user,
        body.name,
        body.image
    )

