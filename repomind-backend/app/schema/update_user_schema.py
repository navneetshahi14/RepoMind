from pydantic import BaseModel

class UpdateUserRequest(BaseModel):
    name : str | None = None
    image : str | None = None