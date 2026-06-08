from pydantic import BaseModel

class MessageRequest(BaseModel):
    question:str