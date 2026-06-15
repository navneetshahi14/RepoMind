from pathlib import Path

from langchain_text_splitters import RecursiveCharacterTextSplitter

code_splitter = RecursiveCharacterTextSplitter( chunk_size=1200, chunk_overlap=200, separators=[ "\nclass ", "\ndef ", "\nasync def ", "\ninterface ", "\ntype ", "\n\n", "\n", " ", "" ] )

pdf_splitter = RecursiveCharacterTextSplitter( chunk_size=1000, chunk_overlap=200 )

def read_file(
    file_path:str
) -> str:
    try:
        with open(
            file_path,
            "r",
            encoding="utf-8"
        ) as f:
            return f.read()
        
    except Exception:
        return ""
    
    
def split_into_chunks(
    text:str,
):
    splitting = pdf_splitter.split_text(
        text
    )
    print("count Token",count_token(text))
    
    return splitting

def count_token(text:str):
    return len(
        text.split()
    )