# Chapter 12
from hypothesis import given, strategies as st

from builders import an_order
from pricing import discount_for

@given(st.integers(min_value=100, max_value=1_000_000))
def test_discount_never_exceeds_cap(subtotal_cents):
    order = an_order(
        subtotal_cents=subtotal_cents, bag_count=3,
        is_subscriber=True, promo_code="ROAST10",
    )
    assert discount_for(order) <= (
        subtotal_cents * 2_000 // 10_000
    )


# Chapter 14's sidebar: the same rule over every input.
@given(
    st.integers(min_value=1, max_value=20),
    st.booleans(),
    st.booleans(),
    st.integers(min_value=100, max_value=1_000_000),
)
def test_never_discounts_more_than_20_percent(
    bag_count, is_subscriber, has_promo, subtotal_cents,
):
    order = an_order(
        bag_count=bag_count, is_subscriber=is_subscriber,
        promo_code="ROAST10" if has_promo else None,
        subtotal_cents=subtotal_cents,
    )
    assert discount_for(order) <= subtotal_cents * 2_000 // 10_000
