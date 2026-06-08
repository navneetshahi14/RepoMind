from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.usage_model import Usage
from app.models.user_model import User

from app.services.auth.password_service import (
    hash_password,verify_password
)

from app.services.auth.jwt_service import (
    create_access_token
)

def register_user(
    db:Session,
    name,
    email,
    password
):
    print(password)
    existing_user = db.query(
        User
    ).filter(
        User.email == email
    ).first()
    
    if existing_user:
        
        raise HTTPException(
            status_code=409,
            detail="User already exists"
        )
        
    user = User(
        name=name,
        email=email,
        hashed_password=hash_password(password)
    )
    
    db.add(user)

    db.commit()

    db.refresh(user)

    usage = Usage(
        user_id=user.id,
        repo_count=0,
        pdf_count=0,
        messages_count=0
    )

    db.add(usage)
    db.commit()

    token = create_access_token(
        user.id
    )

    return user, token

def login_user(db:Session,email,password):
    user = db.query(
        User
    ).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )
        
    if not verify_password(password,user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )
        
    token = create_access_token(
        user.id
    )
    
    return token
