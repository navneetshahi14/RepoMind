from uuid import UUID

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.database.dependencies import get_db
from app.models.user_model import User

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = decode_access_token(token)
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user_id_raw = payload.get("sub")

    if not user_id_raw:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    try:
        user_id = UUID(str(user_id_raw))
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = (
        db.query(User).filter(User.id == user_id).first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return user