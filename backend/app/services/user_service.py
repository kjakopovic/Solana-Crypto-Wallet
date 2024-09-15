# backend/app/services/user_service.py
import logging
import bcrypt
import uuid
import random
import os

from sqlalchemy.orm import Session
from app.models.database_models import UserDB
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

    # TODO: change the input and return types to Pydantic models
    def create_user(self, password: str):
        logging.info(f"Called create_user")
        logging.info(f"Assigning a random username to the user")

        username = self.generate_random_username()

        if not username or not password:
            logging.error("Invalid request, missing fields")
            raise ValueError("Invalid request, missing fields")

        db_user_username = self.db.query(UserDB).filter(UserDB.username == username).first()
        if db_user_username is not None:
            logging.error("Username already registered")
            raise ValueError("Username already registered")

        try:
            hashed_password = self.hash_password(password)
            random_uuid = str(uuid.uuid4())

            user = UserDB(username=username, password=hashed_password, id=random_uuid)
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)

            user_json = {
                "username": user.username
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

        db_user = self.db.query(UserDB).filter(UserDB.username == username).first()

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
        get_user_info = UserDB.model_construct(**user_json)
        return get_user_info.model_dump()

    def delete_user(self, username: str, password: str):
        logging.info(f"Called delete_user for username: {username}")

        if not username or not password:
            logging.error("Invalid request, missing fields")
            raise ValueError("Invalid request, missing fields")

        db_user = self.db.query(UserDB).filter(UserDB.username == username).first()

        if db_user is None:
            logging.error("User not found")
            raise ValueError("User not found")
        if not self.verify_password(password, db_user.hashed_password):
            logging.error("Invalid password")
            raise ValueError("Invalid password")

        self.db.delete(db_user)
        self.db.commit()

        db_user = self.db.query(UserDB).filter(UserDB.username == username).first()
        if db_user is not None:
            logging.error("Error deleting user")
            raise ValueError("Error deleting user")

        self.db.commit()

        return True

    def load_words_from_file(self, file_path):
        """Load words from a file and return a list of words."""
        logging.info(f"Loading words from file: {file_path}")
        try:
            with open(file_path, "r") as f:
                return f.read().splitlines()
        except FileNotFoundError:
            logging.error(f"File not found: {file_path}")
            raise ValueError(f"File not found: {file_path}")
        except Exception as e:
            logging.error(f"Error loading words from file: {e}")
            raise ValueError(f"Error loading words from file: {e}")

    def generate_random_username(self):
        """Generate a random username using a random attribute and a random noun."""
        logging.info("Generating random username")

        # Define the correct paths relative to the current file
        base_path = os.path.dirname(os.path.abspath(__file__))
        attributes_file = os.path.join(base_path, '..', '..', 'words', 'attributes.txt')
        nouns_file = os.path.join(base_path, '..', '..', 'words', 'nouns.txt')

        # Check if the files exist
        if not os.path.exists(attributes_file):
            logging.error(f"File not found: {attributes_file}")
            raise ValueError(f"File not found: {attributes_file}")
        if not os.path.exists(nouns_file):
            logging.error(f"File not found: {nouns_file}")
            raise ValueError(f"File not found: {nouns_file}")

        attributes = self.load_words_from_file(attributes_file)
        nouns = self.load_words_from_file(nouns_file)

        if not attributes or not nouns:
            logging.error("Error loading words")
            raise ValueError("Error loading words")

        # Generate a random username and check if it already exists in the database
        while True:
            random_attribute = random.choice(attributes)
            random_noun = random.choice(nouns)

            username = random_attribute + " " + random_noun

            db_user = self.db.query(UserDB).filter(UserDB.username == username).first()
            if db_user is None:
                logging.info(f"Generated username: {username}")
                break

            logging.info(f"Username already exists: {username}")
            logging.info("Generating another username")

        return username
