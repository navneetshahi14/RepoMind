from sqlalchemy.orm import Session
from app.models.user_model import User


def update_user_profile(
    db:Session,
    user:User,
    name,image
):
    if name:
        user.name = name
    if image:
        user.image = image
        
    db.commit()
    
    db.refresh(
        user
    )
    
    return user
