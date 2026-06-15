from pydantic import BaseModel

class ExplainFileRequest(BaseModel):
    file_path:str
    
class ExplainFolderRequest(BaseModel):
    folder_path:str
    