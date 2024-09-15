# backend/app/api/user_routes.py
import logging

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.user_service import UserService
from app.models.json_models import RegisterUser, User

# Initialize the router
router = APIRouter()

# TODO: When creating or deleting a user, it might be saved but the API might return an error.


@router.post("/register-user/")
def create_user(request: RegisterUser, db: Session = Depends(get_db)):
    logging.info(f"Creating user")
    user_service = UserService(db)

    if not request.password:
        raise HTTPException(status_code=400, detail="Invalid request")
    try:
        user = user_service.create_user(request.password)
        return JSONResponse(status_code=201, content={"user": user, "message": "User created successfully"})
    except Exception as e:
        logging.error(f"Error creating user: {e}")
        raise HTTPException(status_code=400, detail="Error creating user")


@router.get("/get-user/")
def get_user(get_user_info: User, db: Session = Depends(get_db)):
    logging.info(f"Getting user with username: {get_user_info.username}")
    user_service = UserService(db)

    if not get_user_info.username or not get_user_info.password:
        raise HTTPException(status_code=400, detail="Invalid request")
    try:
        user = user_service.get_user(get_user_info.username, get_user_info.password)
        return JSONResponse(status_code=200, content={"user": user, "message": "User retrieved successfully"})
    except Exception as e:
        logging.error(f"Error getting user: {e}")
        raise HTTPException(status_code=400, detail="Error getting user")


@router.delete("/delete-user/")
def delete_user(get_user_info: User, db: Session = Depends(get_db)):
    logging.info(f"Deleting user with username: {get_user_info.username}")
    user_service = UserService(db)

    if not get_user_info.username or not get_user_info.password:
        raise HTTPException(status_code=400, detail="Invalid request")
    try:
        user = user_service.delete_user(get_user_info.username, get_user_info.password)
        return JSONResponse(status_code=200, content={"user": user, "message": "User deleted successfully"})
    except Exception as e:
        logging.error(f"Error deleting user: {e}")
        raise HTTPException(status_code=400, detail="Error deleting user")
