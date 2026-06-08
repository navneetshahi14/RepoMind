from app.models.usage_model import Usage


def get_or_create_usage(db, user_id):
    usage = db.query(
        Usage
    ).filter(
        Usage.user_id == user_id
    ).first()

    if usage is None:
        usage = Usage(
            user_id=user_id,
            repo_count=0,
            pdf_count=0,
            messages_count=0
        )

        db.add(usage)
        db.commit()
        db.refresh(usage)

    return usage


def increment_pdf_usage(
        db,
        user_id
):

    usage = get_or_create_usage(db, user_id)

    usage.pdf_count += 1

    db.commit()


def increment_repo_usage(
        db,
        user_id
):

    usage = get_or_create_usage(db, user_id)

    usage.repo_count += 1

    db.commit()


def increment_message_usage(
        db,
        user_id
):

    usage = get_or_create_usage(db, user_id)

    usage.messages_count += 1

    db.commit()
