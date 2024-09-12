# backend/app/core/solana_service.py
import logging

from solathon import Client, Keypair, PublicKey
from solathon.utils import RPCRequestError


class SolanaService:
    def __init__(self):
        self.client = Client("https://api.devnet.solana.com")

    def create_wallet(self):
        """"Generate a new wallet (keypair)"""
        keypair = Keypair()
        return {
            "public_key": str(keypair.public_key),
            "private_key": str(keypair.private_key)
        }

    def get_balance(self, public_key_str: str):
        """"Get the balance of a wallet"""
        try:
            public_key = PublicKey(public_key_str)
            balance = self.client.get_balance(public_key)
            return balance
        except RPCRequestError as e:
            logging.error(f"Error getting balance for wallet {public_key_str}: {e}")
            raise e
