# backend/app/api/wallet_routes.py
import logging

from fastapi import APIRouter, HTTPException
from app.services.solana_service import SolanaService


# Initialize the router
router = APIRouter()
solana_service = SolanaService()


@router.post("/create-wallet")
def create_wallet():
    """Endpoint to generate a new wallet"""
    logging.info("Received request to create a new wallet")
    wallet = solana_service.create_wallet()
    logging.info(f"Created wallet with public key: {wallet['public_key']}")
    logging.info(f"Created wallet with private key: {wallet['private_key']}")

    return wallet


@router.get("/get-balance/{public_key}")
def wallet_balance(public_key: str):
    """Endpoint to get the balance of a wallet"""
    logging.info(f"Received request to get balance for wallet: {public_key}")

    try:
        balance = solana_service.get_balance(public_key)
        logging.info(f"Balance for wallet {public_key}: {balance}")
        return {"balance": balance}
    except Exception as e:
        logging.error(f"Error getting balance for wallet {public_key}: {e}")
        raise HTTPException(status_code=400, detail="Error getting balance")

# TODO: add endpoint to fetch wallet info, such as keys
