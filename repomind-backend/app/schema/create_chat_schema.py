from pydantic import BaseModel

class CreateChatRequest(BaseModel):
    source_id:int
    title:str
    
    