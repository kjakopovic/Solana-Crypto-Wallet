# backend/app/services/user_service.py
import logging
import bcrypt

from sqlalchemy.orm import Session
from app.models.user_model import User


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def hash_password(self, password: str) -> str:
        logging.info("Hashing password")
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        return hashed_password.decode("utf-8")

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        logging.info("Verifying password")
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

    def create_user(self, username: str, email: str, full_name: str, password: str):
        logging.info(f"Called create_user for username: {username}")

        if not username or not email or not full_name or not password:
            logging.error("Invalid request, missing fields")
            raise ValueError("Invalid request, missing fields")

        db_user_email = self.db.query(User).filter(User.email == email).first()
        db_user_username = self.db.query(User).filter(User.username == username).first()
        if db_user_email is not None:
            logging.error("Email already registered")
            raise ValueError("Email already registered")
        elif db_user_username is not None:
            logging.error("Username already registered")
            raise ValueError("Username already registered")

        try:
            hashed_password = self.hash_password(password)
            user = User(username=username, email=email, full_name=full_name, hashed_password=hashed_password)
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            return user
        except Exception as e:
            logging.error(f"Error creating user: {e}")
            raise ValueError("Error creating user")
