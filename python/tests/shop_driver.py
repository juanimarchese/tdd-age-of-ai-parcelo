"""Chapter 6: the acceptance-test driver. Tests speak domain; HTTP lives here."""
from fastapi.testclient import TestClient

from shop import (CatalogPricing, InMemoryInventory, InMemoryPlacedOrders,
                  PlacedOrder, build_app)


class ShopDriver:
    def __init__(self):
        self.prices, self.inventory = {}, InMemoryInventory()
        app = build_app(
            orders=InMemoryPlacedOrders(),
            pricing=CatalogPricing(self.prices),
            inventory=self.inventory,
        )
        self.client = TestClient(app)

    def stocks(self, sku, *, price_cents, bags):
        self.prices[sku] = price_cents
        self.inventory.stock(sku, bags)

    def place_order(self, *, customer_id, items):
        lines = [{"sku": s, "quantity": q} for s, q in items]
        res = self.client.post("/orders", json={
            "customer_id": customer_id, "items": lines,
        })
        assert res.status_code == 201, res.text
        return PlacedOrder(**res.json())

    def try_to_place_order(self, *, customer_id, items):
        res = self._post(customer_id, items)
        return res.status_code, res.json()

    def _post(self, customer_id, items):
        lines = [{"sku": s, "quantity": q} for s, q in items]
        return self.client.post("/orders", json={
            "customer_id": customer_id, "items": lines,
        })
