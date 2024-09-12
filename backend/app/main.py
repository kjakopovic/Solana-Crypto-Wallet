# backend/app/main.py

import logging
from fastapi import FastAPI
from app.api.wallet_routes import router as wallet_router

# Initialize FastAPI app and logging
app = FastAPI()
logging.basicConfig(level=logging.INFO)

# Include router for the wallet-related routes
app.include_router(wallet_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
