import os
from collections.abc import Generator

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")


class Base(DeclarativeBase):
    pass


# O engine só é criado quando DATABASE_URL estiver configurada.
engine = create_engine(DATABASE_URL) if DATABASE_URL else None

SessionLocal = (
    sessionmaker(bind=engine, autoflush=False, autocommit=False)
    if engine
    else None
)

def get_db() -> Generator[Session, None, None]:
    if SessionLocal is None:
        raise RuntimeError("Banco de dados não configurado.")

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()