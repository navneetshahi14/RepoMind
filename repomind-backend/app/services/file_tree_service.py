from pathlib import Path

from app.utils.file_utils import should_ignore

def build_file_tree(
    repo_path:str
): 
    files = []
    
    root = Path(repo_path)

    for file in root.rglob("*"):
        
        if file.is_dir():
            continue
        
        relative_path = str(
            file.relative_to(root)
        )
        
        if should_ignore(
            relative_path
        ):
            continue
        
        files.append(
            {
                "path":relative_path,
                "name":file.name,
                "extension":file.suffix,
                "size":file.stat().st_size
            }
        )
        
    
    return files

