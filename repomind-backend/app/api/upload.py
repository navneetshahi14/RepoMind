from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database.dependency import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.user_model import User
from app.models.usage_model import Usage

from app.services.pdf_service import process_pdf
from app.services.limits.limits_service import check_pdf_limit
from app.services.limits.usage_service import increment_pdf_usage


router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

@router.post('/pdf')
async def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    usage = db.query(
        Usage
    ).filter(
        Usage.user_id == current_user.id
    ).first()
    
    if not check_pdf_limit(
        usage
    ):
        raise HTTPException(
            status_code=403,
            detail="PDF limit exceeded"
        )
    
    result = await process_pdf(file)
    
    increment_pdf_usage(db,current_user.id)
    
    return {
        "success": True,
        "message": "PDF uploaded successfully",
        **result
    }
