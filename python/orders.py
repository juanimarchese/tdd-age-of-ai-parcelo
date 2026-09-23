from dataclasses import dataclass

from pricing import DiscountInput


@dataclass
class Order(DiscountInput):
    """Like the TypeScript anOrder(): a DiscountInput you can store."""
    id: str = "ord_1"
    status: str = "placed"
