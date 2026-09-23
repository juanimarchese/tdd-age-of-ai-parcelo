"""Chapter 3's builder. Chapters 5, 8, 11, and 12 reuse it."""
from orders import Order


def an_order(*, bag_count=1, subtotal_cents=1500,
             is_subscriber=False, promo_code=None):
    return Order(
        bag_count=bag_count,
        subtotal_cents=subtotal_cents,
        is_subscriber=is_subscriber,
        promo_code=promo_code,
    )
