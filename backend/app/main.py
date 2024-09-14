# backend/app/main.py
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.api.wallet_routes import router as wallet_router
from app.api.transaction_routes import router as transaction_router
from app.api.user_routes import router as user_router
from app.db.database import Base, engine
from app import init_script

# Initialize logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s',
    level=logging.DEBUG
)

# Overwrite classes
init_script.initialize_overwrite()


# Define the lifespan function
@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("Application startup")
    try:
        # Create the tables
        logging.info("Creating tables")
        Base.metadata.create_all(bind=engine)
        logging.info("Tables created")
        yield
    finally:
        logging.info("Application shutdown")
        logging.info("Closing database connection")
        engine.dispose()

# Initialize FastAPI app and logging
app = FastAPI(lifespan=lifespan)

# Include router routes
app.include_router(wallet_router)
app.include_router(transaction_router)
app.include_router(user_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}