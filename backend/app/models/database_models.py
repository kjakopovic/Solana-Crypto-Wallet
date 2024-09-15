# backend/app/models/database_models.py
import uuid

from sqlalchemy import Column, Integer, String
from app.db.database import Base

# TODO: check maybe if it can be put inside db package


class UserDB(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    username = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    refresh_token = Column(String(255))

    wallet_public_key = Column(String(255))  # for now, we will store the public key here
    wallet_private_key = Column(String(255))  # for now, we will store the private key here

    # TODO: After dev is done, remove wallet keys from here!!!
