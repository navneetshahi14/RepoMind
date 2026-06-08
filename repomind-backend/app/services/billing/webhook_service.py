import os
import stripe

from dotenv import load_dotenv

load_dotenv()

endpoint_secret = os.getenv(
    "STRIPE_WEBHOOK_SECRET"
)