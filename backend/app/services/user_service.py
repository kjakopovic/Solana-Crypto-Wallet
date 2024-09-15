# backend/app/services/user_service.py
import logging
import bcrypt

from sqlalchemy import text
from sqlalchemy.orm import Session
from app.models.database_models import User
from app.models.json_models import User


class UserService:
    def __init__(self, db: Session):
        self.db = db
        self.logger = logging.getLogger(self.__class__.__name__)

    def hash_password(self, password: str) -> str:
        logging.info("Hashing password")
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        return hashed_password.decode("utf-8")

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        logging.info("Verifying password")
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

    # TODO: change the inpur and return types to Pydantic models
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

            user_json = {
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
                "password": user.hashed_password
            }

            user_create_request = User.model_construct(**user_json)
            return user_create_request.model_dump()
        except Exception as e:
            logging.error(f"Error creating user: {e}")
            raise ValueError("Error creating user")

    def get_user(self, username: str, password: str):
        logging.info(f"Called get_user for username: {username}")

        if not username or not password:
            logging.error("Invalid request, missing fields")
            raise ValueError("Invalid request, missing fields")

        db_user = self.db.query(User).filter(User.username == username).first()

        if db_user is None:
            logging.error("User not found")
            raise ValueError("User not found")
        if not self.verify_password(password, db_user.hashed_password):
            logging.error("Invalid password")
            raise ValueError("Invalid password")

        user_json = {
            "username": db_user.username,
            "email": db_user.email,
            "full_name": db_user.full_name,
        }
        get_user_info = User.model_construct(**user_json)
        return get_user_info.model_dump()

    def delete_user(self, username: str, password: str):
        logging.info(f"Called delete_user for username: {username}")

        if not username or not password:
            logging.error("Invalid request, missing fields")
            raise ValueError("Invalid request, missing fields")

        db_user = self.db.query(User).filter(User.username == username).first()

        if db_user is None:
            logging.error("User not found")
            raise ValueError("User not found")
        if not self.verify_password(password, db_user.hashed_password):
            logging.error("Invalid password")
            raise ValueError("Invalid password")

        self.db.delete(db_user)
        self.db.commit()

        db_user = self.db.query(User).filter(User.username == username).first()
        if db_user is not None:
            logging.error("Error deleting user")
            raise ValueError("Error deleting user")

        self.db.execute(text("DBCC CHECKIDENT ('users', RESEED, 0)"))
        self.db.commit()

        return True
