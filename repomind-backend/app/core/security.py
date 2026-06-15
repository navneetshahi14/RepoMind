from datetime import datetime, timedelta, UTC
from dotenv import load_dotenv
from jose import jwt
from passlib.context import CryptContext
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password:str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_pass:str, hashed_pass:str) -> bool:
    return pwd_context.verify(
        plain_pass,hashed_pass
    )
    
def create_access_token(
    data:dict
)-> str:
    to_encode = data.copy()
    
    expire = datetime.now(UTC)+timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    
    to_encode.update(
        {"exp":expire}
    )
    
    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    
    
def decode_access_token(
    token:str
):
    return jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM]
    )