# backend/app/models/json_models.py
# Modify the JSON models to use Pydantic models.
from pydantic import BaseModel

# TODO: Add more fields as needed


class UserCreateRequest(BaseModel):
    username: str
    email: str
    full_name: str
    password: str
