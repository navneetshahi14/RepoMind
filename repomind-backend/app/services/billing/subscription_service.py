from app.models.subscription_model import Subscription
from sqlalchemy.orm import Session

def upgrade_to_pro(
    db:Session,
    user_id,
    customer_id,
    subscription_id
):
    subscription = db.query(
        Subscription
    ).filter(
        Subscription.user_id == user_id
    ).first()
    
    subscription.plan = "pro"
    subscription.status = "active"
    subscription.stripe_customer_id = customer_id
    subscription.stripe_subscription_id = subscription_id

    db.commit()
    

def get_current_subscription(
    db:Session,
    user_id
):
    return db.query(
        Subscription
    ).filter(
        Subscription.user_id == user_id
    ).first()