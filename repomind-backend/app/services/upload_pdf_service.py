import os
from uuid import UUID

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.source_model import Source
from app.repositories.source_repository import (
    create_source,
    update_source
)
from app.services.process_pdf_service import process_pdf


UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


async def upload_pdf(
    db: Session,
    project_id: UUID,
    file: UploadFile
):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        content = await file.read()

        buffer.write(
            content
        )

    source = Source(
        project_id=project_id,
        type="PDF",
        source_url=file_path,
        file_name=file.filename,
        status="PROCESSING",
        error_message=None
    )

    source = create_source(
        db,
        source
    )

    try:

        process_pdf(
            db=db,
            source_id=source.id,
            pdf_path=file_path
        )

        source.status = "COMPLETED"

    except Exception as e:

        source.status = "FAILED"

        source.error_message = str(
            e
        )

    update_source(
        db,
        source
    )

    return source