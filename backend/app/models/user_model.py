# backend/app/models/user_model.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.database import Base

# TODO: check maybe if it can be put inside db package


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(255), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    full_name = Column(String(255))
    hashed_password = Column(String(255))
    wallet_public_key = Column(String(255))
