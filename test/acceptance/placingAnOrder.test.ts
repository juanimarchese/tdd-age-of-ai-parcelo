// test/acceptance/placingAnOrder.test.ts (Chapter 6)
import { describe, it, expect, beforeEach } from "vitest";
import { ShopDriver } from "./shopDriver";

const threeBagsOf = (sku: string) => ({
  customerId: "c-1",
  items: [{ sku, quantity: 3 }],
});

describe("placing an order", () => {
  let shop: ShopDriver;
  beforeEach(() => {
    shop = new ShopDriver();
  });

  it("accepts a one-bag order and records it", async () => {
    shop.stocks("ETHIOPIA-250", { priceCents: 1800, bags: 10 });
    const order = await shop.placeOrder({
      customerId: "c-1",
      items: [{ sku: "ETHIOPIA-250", quantity: 1 }],
    });
    expect(order.status).toBe("placed");
    expect(await shop.hasRecorded(order.id)).toBe(true);
  });

  it("gives 10% off an order of three bags", async () => {
    shop.stocks("ETHIOPIA-250", { priceCents: 1800, bags: 10 });
    const order = await shop.placeOrder({
      customerId: "c-1",
      items: [{ sku: "ETHIOPIA-250", quantity: 3 }],
    });
    // 5400 subtotal - 540 discount
    expect(order.totalCents).toBe(4860);
  });

  it("refuses to sell coffee that's out of stock", async () => {
    // Given
    shop.stocks("ETHIOPIA-250", { priceCents: 1800, bags: 2 });
    // When
    const rejection = await shop.tryToPlaceOrder(
      threeBagsOf("ETHIOPIA-250"),
    );
    // Then
    expect(rejection.reason).toBe("out_of_stock");
  });
});
