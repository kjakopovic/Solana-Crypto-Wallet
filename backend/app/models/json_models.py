# backend/app/models/json_models.py
# Modify the JSON models to use Pydantic models.
from pydantic import BaseModel

# TODO: Add more fields as needed


class RegisterUser(BaseModel):
    password: str


# TODO: add fields related to tokens
class User(BaseModel):
    uuid: str
    username: str
    access_token: str
    refresh_token: str


class Token(BaseModel):
    access_token: str
    token_type: str
    token_expire: str = "bearer"
