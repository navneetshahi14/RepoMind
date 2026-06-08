from fastapi import APIRouter, Depends, Request

from sqlalchemy.orm import Session

from app.database.dependency import get_db

from app.models.usage_model import Usage


from app.services.billing.subscription_service import (
    get_current_subscription
)
import stripe

from app.services.billing.webhook_service import endpoint_secret

from app.middleware.auth_middleware import (
    get_current_user
)

from app.services.billing.checkout_service import (
    create_checkout_session
)

router = APIRouter(
    prefix="/billing",
    tags=["Billing"]
)


@router.post("/checkout")
def checkout(
        current_user=Depends(
            get_current_user
        )
):

    session = create_checkout_session(
        current_user.id
    )

    return {
        "checkout_url":
            session.url
    }
    
@router.post("/webhook")
async def webhook(request:Request):
    payload = await request.body()
    
    sig_header = request.headers.get(
        "stripe-signature"
    )
    
    event = stripe.Webhook.construct_event(
        payload,
        sig_header,
        endpoint_secret
    )
    
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        
        user_id = int(
            session["metadata"]["user_id"]
        )
        
    return {
        "success":True
    }
    
@router.get("/current-plan")
def current_plan(
    db:Session = Depends(
        get_db
    ),
    current_user = Depends(
        get_current_user
    )
):
    subscription = get_current_subscription(
        db,
        current_user.id
    )
    
    return subscription

@router.get("/usage")
def usage(
    db:Session = Depends(
        get_db
    ),
    current_user = Depends(
        get_current_user
    )
):
    usage = db.query(
        Usage
    ).filter(
        Usage.user_id == current_user.id
    ).first()
    
    return usage