import { it, expect } from "vitest";
import { anOrder } from "../testing/builders";
import {
  FakePaymentGateway,
  InMemoryIdempotencyKeyRepository,
  InMemoryOrderRepository,
} from "../testing/fakes";
import { RefundService } from "./RefundService";

// Chapter 7
it("processes a refund once per idempotency key", async () => {
  const repo = new InMemoryOrderRepository();
  const gateway = new FakePaymentGateway();
  const keys = new InMemoryIdempotencyKeyRepository();
  const service = new RefundService(repo, gateway, keys);
  const order = anOrder().withSubtotalCents(3000).build();
  await repo.save(order);

  const key = "idem-key-abc123";
  const first = await service.refund(order.id, 1000, key);
  const second = await service.refund(order.id, 1000, key);

  expect(second).toEqual(first);
  expect(gateway.refundCallCount).toBe(1);
});
