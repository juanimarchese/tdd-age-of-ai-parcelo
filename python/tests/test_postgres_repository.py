"""Chapters 5 and 7: integration tests against a real Postgres."""
from builders import an_order
from db import PostgresOrderRepository


def test_order_repository_round_trips_status(db_session):
    repo = PostgresOrderRepository(db_session)
    repo.save(an_order(id="ord_42", status="placed"))
    saved = repo.find_by_id("ord_42")
    assert saved.status == "placed"


def test_each_test_starts_with_an_empty_table(db_session):
    # The previous test saved ord_42 and was rolled back.
    repo = PostgresOrderRepository(db_session)
    assert repo.find_by_id("ord_42") is None


def test_code_that_rolls_back_does_not_break_isolation(db_session):
    repo = PostgresOrderRepository(db_session)
    repo.save(an_order(id="ord_7"))
    db_session.rollback()  # code under test gives up halfway
    assert repo.find_by_id("ord_7") is None
    repo.save(an_order(id="ord_8"))  # the session is still usable
    assert repo.find_by_id("ord_8") is not None
