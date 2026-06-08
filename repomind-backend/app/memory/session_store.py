from collections import defaultdict

session = defaultdict(list)

def add_message(
    session_id,
    role,
    content
):
    session[session_id].append(
        {
            "role":role,
            "content":content
        }
    )
    

def get_message(session_id):
    return session[session_id]