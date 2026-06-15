from app.prompt.tech_stack_prompt import TECH_STACK_PROMPT
from app.prompt.readme_prompt import README_PROMPT
from app.prompt.explain_file_prompt import EXPLAIN_FILE_PROMPT
from app.prompt.explain_folder_prompt import EXPLAIN_FOLDER_PROMPT
from app.prompt import ARCHITECTURE_PROMPT

from app.providers.llm_provider import (
    generate_response
)


def detect_tech_stack(
    context: str
):

    return generate_response(
        system_prompt=TECH_STACK_PROMPT,
        user_prompt=context
    )

import time

def generate_readme(
    context: str,
    custom_prompt: str | None = None
):
    print("generating readme")
    print(custom_prompt)
    # start = time.time()
    data = generate_response(
        system_prompt=custom_prompt or README_PROMPT,
        user_prompt=context
    )
    
    print(data)

    return data


def generate_file_explanation(
    context: str
):

    return generate_response(
        system_prompt=EXPLAIN_FILE_PROMPT,
        user_prompt=context
    )


def generate_folder_explanation(
    context: str
):

    return generate_response(
        system_prompt=EXPLAIN_FOLDER_PROMPT,
        user_prompt=context
    )


def generate_architecture_summary(
    context: str
):
    print(context)
    data = generate_response(
        system_prompt=ARCHITECTURE_PROMPT,
        user_prompt=context
    )
    print(data)
    
    return data
