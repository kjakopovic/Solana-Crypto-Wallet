# backend/app/models/public_key_model.py
from pydantic import BaseModel


class PublicKeyModel(BaseModel):
    received_public_key: str
