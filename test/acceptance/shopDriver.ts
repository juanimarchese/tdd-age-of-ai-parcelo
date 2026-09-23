// test/acceptance/shopDriver.ts (Chapter 6, final shape)
import { buildApp } from "../../src/app";
import type { Order, OrderRequest } from "../../src/orders";
import { CatalogPricing } from "../../src/pricing";
import {
  FakePaymentGateway,
  InMemoryInventory,
  InMemoryOrderRepository,
  SequentialIds,
} from "../../src/testing/fakes";

type ShopOrder = Omit<OrderRequest, "paymentToken">;

export class ShopDriver {
  private orders = new InMemoryOrderRepository();
  private prices = new Map<string, number>();
  private inventory = new InMemoryInventory();
  private app = buildApp({
    orders: this.orders,
    pricing: new CatalogPricing(this.prices),
    inventory: this.inventory,
    gateway: new FakePaymentGateway(),
    ids: new SequentialIds(),
  });

  stocks(sku: string, s: { priceCents: number; bags: number }) {
    this.prices.set(sku, s.priceCents);
    this.inventory.stock(sku, s.bags);
  }

  async placeOrder(request: ShopOrder): Promise<Order> {
    const res = await this.post(request);
    if (res.statusCode !== 201) {
      throw new Error(
        `POST /orders returned ${res.statusCode}: ${res.body}`,
      );
    }
    return res.json();
  }

  async tryToPlaceOrder(
    request: ShopOrder,
  ): Promise<{ reason: string }> {
    const res = await this.post(request);
    if (res.statusCode === 201) {
      throw new Error("expected the order to be rejected");
    }
    return res.json();
  }

  async hasRecorded(orderId: string): Promise<boolean> {
    return (await this.orders.findById(orderId)) !== null;
  }

  private post(request: ShopOrder) {
    return this.app.inject({
      method: "POST",
      url: "/orders",
      payload: { ...request, paymentToken: "tok_test" },
    });
  }
}
