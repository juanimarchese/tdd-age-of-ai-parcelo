"""Chapter 7: a real Postgres per test session, one rolled-back transaction per test."""
import os
import shutil

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from db import metadata


@pytest.fixture(scope="session")
def engine():
    url = os.environ.get("DATABASE_URL")
    if url:
        engine = create_engine(url.replace("postgres://", "postgresql+psycopg://", 1))
        metadata.create_all(engine)
        yield engine
        engine.dispose()
        return
    if not shutil.which("docker"):
        pytest.skip("needs Docker (Testcontainers) or DATABASE_URL")
    from testcontainers.community.postgres import PostgresContainer
    container = PostgresContainer("postgres:16", driver="psycopg")
    with container as pg:
        engine = create_engine(pg.get_connection_url())
        metadata.create_all(engine)
        yield engine
        engine.dispose()


@pytest.fixture
def db_session(engine):
    connection = engine.connect()
    transaction = connection.begin()
    session = Session(
        bind=connection,
        join_transaction_mode="create_savepoint",
    )
    yield session
    session.close()
    transaction.rollback()
    connection.close()
