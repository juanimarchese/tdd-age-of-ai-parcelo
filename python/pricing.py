"""Python sidebars for Chapters 1, 2, and 8."""
from collections.abc import Callable
from dataclasses import dataclass
from typing import Protocol


def line_total(*, unit_price_cents: int, quantity: int) -> int:
    if quantity < 0:
        raise ValueError("quantity must not be negative")
    return unit_price_cents * quantity


@dataclass
class DiscountInput:
    bag_count: int = 1
    subtotal_cents: int = 1500
    is_subscriber: bool = False
    promo_code: str | None = None


class DiscountRule(Protocol):
    name: str

    def rate_bp_for(self, order: DiscountInput) -> int: ...


@dataclass(frozen=True)
class _Rule:
    name: str
    rate_bp: int
    applies: Callable[[DiscountInput], bool]

    def rate_bp_for(self, order: DiscountInput) -> int:
        return self.rate_bp if self.applies(order) else 0


DISCOUNT_RULES: list[DiscountRule] = [
    _Rule("bulk", 1_000, lambda o: o.bag_count >= 3),
    _Rule("subscriber", 500, lambda o: o.is_subscriber),
    _Rule("promo", 1_000, lambda o: o.promo_code == "ROAST10"),
]


def discount_for(order: DiscountInput) -> int:
    rate_bp = min(
        2_000,
        sum(r.rate_bp_for(order) for r in DISCOUNT_RULES),
    )
    return (order.subtotal_cents * rate_bp) // 10_000
