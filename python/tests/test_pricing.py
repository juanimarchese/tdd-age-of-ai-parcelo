import pytest

from builders import an_order
from pricing import DiscountInput, discount_for, line_total


# Chapter 1
def test_multiplies_unit_price_by_quantity():
    assert line_total(unit_price_cents=1450, quantity=3) == 4350


# Chapter 2 warm-up
def test_negative_quantity_raises():
    with pytest.raises(ValueError):
        line_total(unit_price_cents=1200, quantity=-1)


# Chapter 2
def test_gives_no_discount_for_a_single_bag():
    result = discount_for(DiscountInput(
        bag_count=1, is_subscriber=False,
        promo_code=None, subtotal_cents=1500,
    ))
    assert result == 0


# Chapter 3
def test_gives_10_percent_off_for_3_or_more_bags():
    order = an_order(bag_count=3, subtotal_cents=3000)
    assert discount_for(order) == 300


# Chapter 8
def test_bulk_and_subscriber_stack():
    order = an_order(bag_count=3, is_subscriber=True)
    expected = order.subtotal_cents * 1_500 // 10_000
    assert discount_for(order) == expected


def test_caps_at_20_percent():
    order = an_order(bag_count=3, subtotal_cents=10_000,
                     is_subscriber=True, promo_code="ROAST10")
    assert discount_for(order) == 2_000
