from sqlalchemy.orm import Session
from app.models.user_model import User

def get_user_by_email(
    db:Session,
    email:str
):
    return (
        db.query(User).filter(
            User.email == email
        ).first()
    )
    
def get_user_by_username(
    db:Session,
    name:str
):
    return (
        db.query(
            User
        ).filter(User.name == name).first()
    )
    
def create_user(
    db:Session,
    user:User
):
    db.add(user)
    db.commit()
    db.refresh(user)

    return user