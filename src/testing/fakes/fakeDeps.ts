import type { OrderServiceDeps } from "../../orders";
import { FakePaymentGateway } from "./FakePaymentGateway";
import { FixedClock } from "./FixedClock";
import { InMemoryOrderRepository } from "./InMemoryOrderRepository";

// Chapter 7: a fake for every dependency; override only what
// the test cares about.
export const fakeDeps = (): OrderServiceDeps => ({
  orders: new InMemoryOrderRepository(),
  pricing: { quote: async () => ({ totalCents: 3000 }) },
  inventory: { tryReserve: async () => true },
  gateway: new FakePaymentGateway(),
  clock: new FixedClock(new Date("2026-01-01")),
  ids: { next: () => "ord_1" },
});
