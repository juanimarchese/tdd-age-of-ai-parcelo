import pytest
from shipping import shipping_cost


# Chapter 10
@pytest.mark.parametrize("subtotal, expected", [
    (7500, 0), (5000, 0), (4999, 599),
])
def test_us_shipping(subtotal, expected):
    cost = shipping_cost("US", subtotal, weight_grams=800)
    assert cost == expected

def test_rejects_negative_weight():
    with pytest.raises(ValueError):
        shipping_cost("US", 1000, weight_grams=-1)


def test_international_per_started_kg():
    assert shipping_cost("DE", 9000, weight_grams=1200) == 2000
    assert shipping_cost("DE", 9000, weight_grams=1000) == 1600
