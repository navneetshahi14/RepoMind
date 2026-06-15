IGNORE_DIRECTORIES = {
    ".git",
    "node_modules",
    "__pycache__",
    ".next",
    "dist",
    "build",
    ".venv"
}

SUPPORTED_EXTENSIONS = {
    ".py",
    ".js",
    ".ts",
    ".tsx",
    ".jsx",
    ".json",
    ".md",
    ".txt",
    ".html",
    ".css"
}

def should_ignore(
    path:str
) -> bool:
    parts = path.split("/")
    
    return any(
        part in IGNORE_DIRECTORIES
        for part in parts
    )
    
    