# backend/app/models/json_models.py
# Modify the JSON models to use Pydantic models.
from pydantic import BaseModel

# TODO: Add more fields as needed


class RegisterUser(BaseModel):
    password: str


# TODO: add fields related to tokens
class User(BaseModel):
    username: str

