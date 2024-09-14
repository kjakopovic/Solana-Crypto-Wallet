# backend/app/api/user_routes.py
import logging

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user_model import User
from app.services.user_service import UserService

# Initialize the router
router = APIRouter()
user_service = UserService(get_db())


@router.post("/create-user/")
def create_user(username: str, email: str, full_name: str, password: str):
    logging.info(f"Creating user with username: {username}")
    if not username or not email or not full_name or not password:
        raise HTTPException(status_code=400, detail="Invalid request")
    try:
        user = user_service.create_user(username, email, full_name, password)
        return JSONResponse(status_code=201, content={"user": user, "message": "User created successfully"})
    except Exception as e:
        logging.error(f"Error creating user: {e}")
        raise HTTPException(status_code=400, detail="Error creating user")
