# backend/app/core/solana_service.py
import logging

from solathon import Client, Keypair, PublicKey, Transaction
from solathon.utils import RPCRequestError
from solathon.core.instructions import transfer


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

    def transfer(self, sender: str, recipient: str, amount: int):
        """Transfer tokens between wallets"""
        logging.info(f"Transferring {amount} tokens from {sender} to {recipient}")

        try:
            sender_keypair = Keypair().from_private_key(sender)
            receiver_public_key = PublicKey(recipient)
        except Exception as e:
            logging.error(f"Error creating keypair or public key: {e}")
            raise e

        try:
            sender_balance = self.client.get_balance(sender_keypair.public_key)
            logging.info(f"Sender balance: {sender_balance}")

            if sender_balance < amount:
                raise Exception("Insufficient balance")

            min_balance_for_rent_exemption = self.client.get_minimum_balance_for_rent_exemption(0)
            logging.info(f"Minimum balance for rent exemption: {min_balance_for_rent_exemption} lamports")
            if sender_balance < amount + min_balance_for_rent_exemption:
                raise Exception("Insufficient balance to cover transaction fees")

            # Fetch the recent blockhash
            recent_blockhash = self.client.get_recent_blockhash().blockhash

            instruction = transfer(
                from_public_key=sender_keypair.public_key,
                to_public_key=receiver_public_key,
                lamports=amount,
            )
            transaction = Transaction(
                instructions=[instruction],
                recent_blockhash=recent_blockhash,
                signers=[sender_keypair]
            )
            transaction.sign()
            logging.info(f"Sending transaction: {transaction}")

            result = self.client.send_transaction(transaction)
            logging.info(f"Transaction result: {result}")

            return result
        except RPCRequestError as e:
            logging.error(f"RPCRequestError: {e}")
            raise e
        except Exception as e:
            logging.error(f"Error transferring tokens: {e}")
            raise e
