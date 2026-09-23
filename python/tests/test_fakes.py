from builders import an_order
from fakes import InMemoryOrderRepository


# Chapter 4
def test_stores_an_order_and_retrieves_it_by_id():
    repo = InMemoryOrderRepository()
    repo.save(an_order())
    assert repo.find_by_id("ord_1").id == "ord_1"


def test_returns_none_for_a_missing_order():
    assert InMemoryOrderRepository().find_by_id("missing") is None
