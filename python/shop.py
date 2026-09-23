"""Chapter 6: the walking skeleton's HTTP app, in FastAPI."""
from dataclasses import dataclass, field
from itertools import count

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from pricing import DiscountInput, discount_for, line_total


class InMemoryInventory:
    def __init__(self):
        self._bags: dict[str, int] = {}

    def stock(self, sku: str, bags: int) -> None:
        self._bags[sku] = self._bags.get(sku, 0) + bags

    def reserve(self, sku: str, bags: int) -> bool:
        if self._bags.get(sku, 0) < bags:
            return False
        self._bags[sku] -= bags
        return True


@dataclass
class CatalogPricing:
    prices: dict[str, int]

    def quote(self, items: list[tuple[str, int]]) -> int:
        subtotal = sum(line_total(unit_price_cents=self.prices[sku], quantity=q)
                       for sku, q in items)
        bags = sum(q for _, q in items)
        discount = discount_for(DiscountInput(bag_count=bags, subtotal_cents=subtotal))
        return subtotal - discount


@dataclass
class PlacedOrder:
    id: str
    customer_id: str
    total_cents: int
    status: str = "placed"


class Item(BaseModel):
    sku: str
    quantity: int


class OrderRequest(BaseModel):
    customer_id: str
    items: list[Item]


@dataclass
class InMemoryPlacedOrders:
    saved: dict[str, PlacedOrder] = field(default_factory=dict)

    def save(self, order: PlacedOrder) -> None:
        self.saved[order.id] = order


def build_app(*, orders, pricing: CatalogPricing, inventory: InMemoryInventory) -> FastAPI:
    app = FastAPI()
    ids = count(1)

    @app.post("/orders", status_code=201)
    def place_order(request: OrderRequest):
        items = [(i.sku, i.quantity) for i in request.items]
        # ponytail: reserves line by line with no rollback; a real inventory needs one transaction
        if not all(inventory.reserve(sku, q) for sku, q in items):
            return JSONResponse({"reason": "out_of_stock"}, status_code=409)
        order = PlacedOrder(id=f"ord_{next(ids)}", customer_id=request.customer_id,
                            total_cents=pricing.quote(items))
        orders.save(order)
        return order

    return app
