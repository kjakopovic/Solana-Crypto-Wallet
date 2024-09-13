# backend/app/init_script.py

import logging

from typing import Optional
from solathon.core.types.block import BlockHashType
from solathon.utils import RPCResponse, validate_commitment, Commitment

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s'
)


class CustomBlockHash:
    logging.info("Overwriting BlockHash class")
    '''
    Convert Block Hash JSON to Class
    '''
    def __init__(self, response: BlockHashType) -> None:
        self.blockhash = response['blockhash']
        self.fee_calculator = response.get('feeCalculator', None)

    def __repr__(self) -> str:
        return f"BlockHash(blockhash={self.blockhash!r}, fee_calculator={self.fee_calculator!r})"


def custom_get_recent_blockhash(self, commitment: Optional[Commitment] = None) -> RPCResponse[BlockHashType] | CustomBlockHash:
    logging.info("Overwriting get_recent_blockhash method")
    """
    Returns the recent blockhash.

    Args:
        commitment (Commitment, optional): The level of commitment desired when querying state.

    Returns:
        RPCResponse: The response from the RPC endpoint.
    """
    commitment = validate_commitment(commitment) if commitment else None
    response = self.build_and_send_request("getLatestBlockhash", [commitment])
    if self.clean_response:
        return CustomBlockHash(response["value"])
    return response


def overwrite_classes():
    logging.info("Overwriting classes")
    from solathon.core.types.block import BlockHash
    BlockHash.__init__ = CustomBlockHash.__init__
    BlockHash.__repr__ = CustomBlockHash.__repr__
    from solathon.client import Client
    Client.get_recent_blockhash = custom_get_recent_blockhash


def initialize_overwrite():
    overwrite_classes()
    print("Classes overwritten")
    logging.info("Classes overwritten")
