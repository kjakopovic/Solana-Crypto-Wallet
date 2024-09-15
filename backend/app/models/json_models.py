# backend/app/models/json_models.py
# Modify the JSON models to use Pydantic models.
from pydantic import BaseModel

# TODO: Add more fields as needed


class User(BaseModel):
    username: str
    password: str


class GetUserInfo(BaseModel):
    username: str
    password: str
