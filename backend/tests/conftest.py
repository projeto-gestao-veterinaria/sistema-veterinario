import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.connection import Base, get_db

from app import models
from app.data.catalogo_vacinas import CATALOGO_VACINAS
from app.models.catalogo_vacina import CatalogoVacina


SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


@pytest.fixture(scope="function")
def db_session():
    # Cria todas as tabelas no banco de teste
    Base.metadata.create_all(bind=engine)

    # Semeia o catálogo de vacinas
    seed_session = TestingSessionLocal()
    seed_session.add_all(
        [CatalogoVacina(**item) for item in CATALOGO_VACINAS]
    )
    seed_session.commit()
    seed_session.close()

    session = TestingSessionLocal()

    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):

    def _override_get_db():
        try:
            yield db_session
        finally:
            pass

    # Faz o FastAPI usar o banco de testes
    app.dependency_overrides[get_db] = _override_get_db

    with TestClient(app) as test_client:
        yield test_client

    # Remove o override depois do teste
    app.dependency_overrides.clear()