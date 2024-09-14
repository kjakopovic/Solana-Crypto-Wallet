# backend/app/api/transaction_routes.py

import logging

from fastapi import APIRouter, HTTPException
from app.services.solana_service import SolanaService


# Initialize the router
router = APIRouter()
solan_service = SolanaService()


@router.post("/transfer")
def transfer(request: dict):
    """Endpoint to transfer tokens between wallets"""
    logging.info("Received request to transfer tokens")
    sender_private_key = request.get("sender")
    recipient_public_key = request.get("recipient")
    amount = request.get("amount")

    if not sender_private_key or not recipient_public_key or not amount:
        raise HTTPException(status_code=400, detail="Invalid request")

    try:
        result = solan_service.transfer(sender_private_key, recipient_public_key, amount)
        logging.info(f"Transfer result: {result}")
        return result
    except Exception as e:
        logging.error(f"Error transferring tokens: {e}")
        raise HTTPException(status_code=400, detail="Error transferring tokens")
