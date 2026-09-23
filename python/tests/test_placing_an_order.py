"""Chapter 6: acceptance tests in domain language."""
import pytest

from shop_driver import ShopDriver


@pytest.fixture
def shop():
    return ShopDriver()


def test_three_bags_get_ten_percent_off(shop):
    shop.stocks("ETHIOPIA-250", price_cents=1800, bags=10)
    order = shop.place_order(
        customer_id="c-1", items=[("ETHIOPIA-250", 3)]
    )
    assert order.total_cents == 4860


def test_refuses_coffee_that_is_out_of_stock(shop):
    shop.stocks("ETHIOPIA-250", price_cents=1800, bags=1)
    status, body = shop.try_to_place_order(
        customer_id="c-1", items=[("ETHIOPIA-250", 2)]
    )
    assert (status, body) == (409, {"reason": "out_of_stock"})
