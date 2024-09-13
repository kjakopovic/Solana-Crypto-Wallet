# backend/app/main.py

import logging
import app.init_script

from fastapi import FastAPI
from app.api.wallet_routes import router as wallet_router
from app.api.transaction_routes import router as transaction_router

# Initialize logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s'
)

# Overwrite classes
app.init_script.initialize_overwrite()

# Initialize FastAPI app and logging
app = FastAPI()

# Include router for the wallet-related routes
app.include_router(wallet_router)
app.include_router(transaction_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
