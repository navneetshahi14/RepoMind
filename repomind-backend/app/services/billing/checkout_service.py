import os
import stripe


def create_checkout_session(
        user_id: int
):

    session = stripe.checkout.Session.create(

        payment_method_types=[
            "card"
        ],

        mode="subscription",

        line_items=[
            {
                "price": os.getenv(
                    "PRO_PRICE_ID"
                ),
                "quantity": 1
            }
        ],

        success_url=
        "http://localhost:3000/dashboard",

        cancel_url=
        "http://localhost:3000/pricing",

        metadata={
            "user_id": user_id
        }
    )

    return session