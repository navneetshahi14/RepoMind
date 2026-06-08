import os
from app.services.chunking_service import (
    chunk_text
)

SUPPORTED_EXTENSIONS = {
    ".py",
    ".js",
    ".ts",
    ".tsx",
    ".jsx",
    ".java",
    ".cpp",
    ".c",
    ".md",
    ".txt"
}


def read_repo(repo_path):

    documents = []

    for root, dirs, files in os.walk(repo_path):

        dirs[:] = [
            d for d in dirs
            if d not in {
                ".git",
                "node_modules",
                "dist",
                "build",
                "__pycache__"
            }
        ]

        for file in files:

            ext = os.path.splitext(file)[1]

            if ext not in SUPPORTED_EXTENSIONS:
                continue

            path = os.path.join(
                root,
                file
            )

            try:

                with open(
                    path,
                    "r",
                    encoding="utf-8"
                ) as f:

                    content = f.read()

                documents.append({
                    "file": file,
                    "path": path,
                    "content": content
                })

            except:
                pass

    return documents


def prepare_repo_chunks(
    documents
):
    all_chunks = []

    for doc in documents:
        chunks = chunk_text(
            doc["content"]
        )
        
        for chunk in chunks:
            all_chunks.append({
                "chunk":chunk,
                "file":doc["file"],
                "path":doc["path"]
            })
            
    return all_chunks