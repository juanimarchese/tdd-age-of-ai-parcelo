"""Chapters 5 and 7: the Postgres adapter behind OrderRepository (SQLAlchemy Core)."""
from dataclasses import asdict

from sqlalchemy import (Boolean, Column, Integer, MetaData, String, Table,
                        insert, select)
from sqlalchemy.orm import Session

from orders import Order

metadata = MetaData()

orders = Table(
    "orders", metadata,
    Column("id", String, primary_key=True),
    Column("status", String, nullable=False),
    Column("bag_count", Integer, nullable=False),
    Column("subtotal_cents", Integer, nullable=False),
    Column("is_subscriber", Boolean, nullable=False),
    Column("promo_code", String),
)


class PostgresOrderRepository:
    def __init__(self, session: Session):
        self._session = session

    def save(self, order: Order) -> None:
        self._session.execute(insert(orders).values(**asdict(order)))
        self._session.flush()

    def find_by_id(self, order_id: str) -> Order | None:
        row = self._session.execute(
            select(orders).where(orders.c.id == order_id)
        ).one_or_none()
        return Order(**row._mapping) if row else None
