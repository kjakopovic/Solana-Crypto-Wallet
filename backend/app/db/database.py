# backend/app/db/database.py
import logging
import os

from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


logging.basicConfig(level=logging.DEBUG)
logging.info("Establishing database connection")

# MS SQL Server connection string
DB_SERVER = os.getenv("DB_SERVER", "localhost")
DB_NAME = os.getenv("DB_NAME", "walletDB")
DB_USER = os.getenv("DB_USER", "dbAdmin")
DB_PASSWORD = os.getenv("DB_PASSWORD", "Password123!")

DATABASE_URL = (
    f"mssql+pyodbc://{DB_USER}:{DB_PASSWORD}@{DB_SERVER}:1433/{DB_NAME}?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=Yes"
)
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Test the database connection
try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        logging.info("Database connection successful: %s", result.fetchone())

        logging.info("Creating tables")
        Base.metadata.create_all(bind=engine)
except Exception as e:
    logging.error("Error connecting to the database: %s", e)


# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
