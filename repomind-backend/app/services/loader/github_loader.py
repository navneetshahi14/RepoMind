from git import Repo
import os

REPO_DIR = "repos"


os.makedirs(
    REPO_DIR,
    exist_ok=True
)

def clone_repo(repo_url):
    
    repo_name = repo_url.split("/")[-1]
    
    local_path = os.path.join(
        REPO_DIR,repo_name
    )
    
    if os.path.exists(local_path):
        return local_path
    
    Repo.clone_from(
        repo_url,local_path
    )
    
    return local_path