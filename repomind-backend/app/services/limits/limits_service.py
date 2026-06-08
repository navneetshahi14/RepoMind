FREE_PDF_LIMIT = 5
FREE_REPO_LIMIT = 3
FREE_MESSAGE_LIMIT = 50


def check_repo_limit(
    usage
):

    if usage is None:
        return True

    return usage.repo_count < FREE_REPO_LIMIT


def check_pdf_limit(
    usage
):

    if usage is None:
        return True

    return usage.pdf_count < FREE_PDF_LIMIT


def check_message_limit(
    usage
):

    if usage is None:
        return True

    return usage.messages_count < FREE_MESSAGE_LIMIT