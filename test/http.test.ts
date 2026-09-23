import { it, expect } from "vitest";
import { buildApp } from "../src/app";
import { InMemoryOrderRepository } from "../src/testing/fakes";

// Chapter 7
it("returns 404 for an order that doesn't exist", async () => {
  const orders = new InMemoryOrderRepository();
  const app = buildApp({ orders });
  const res = await app.inject({
    method: "GET",
    url: "/orders/missing",
  });
  expect(res.statusCode).toBe(404);
  expect(res.json()).toEqual({ reason: "order_not_found" });
});
