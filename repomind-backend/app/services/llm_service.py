import ollama

def generate_answer(
    prompt:str
):
    response = ollama.chat(
        model="llama3",
        messages=[{
            "role":"user",
            "content":prompt
        }]
    )
    
    return response["message"]["content"]


def generate_answer_stream(
    prompt: str
):
    stream = ollama.chat(
        model="llama3",
        messages=[{
            "role":"user",
            "content":prompt
        }],
        stream=True
    )

    for chunk in stream:
        content = chunk.get("message", {}).get("content", "")
        if content:
            yield content
