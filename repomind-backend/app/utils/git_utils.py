from pathlib import Path
from git import Repo


def clone_repository(
    repo_url:str,
    destination:str
) -> str:
    """
        Clone repo and return path
    """
    
    repo_name = repo_url.split("/")[-1]
    
    repo_path = Path(destination) / repo_name
    
    if repo_path.exists():
        return str(repo_path)    

    Repo.clone_from(
        repo_url,
        repo_path
    )
    
    return str(repo_path)
    
    