from jose import jwt,JWTError
from datetime import datetime, timedelta

SECRET_KEY = "super_secret_key"

ALGORITHM = "HS256"

def create_access_token(
    user_id:int
):
    payload = {
        "user_id":user_id,
        "exp":datetime.utcnow() + timedelta(days=7)
    }
    
    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    
    return token

def decode_access_token(token:str):
    try:
        
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        
        return payload
    
    except JWTError:
        return None
