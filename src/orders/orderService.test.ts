import { describe, it, expect, vi } from "vitest";
import type { PaymentGateway } from "../payments";
import { anOrderRequest } from "../testing/builders";
import {
  FakePaymentGateway,
  FixedClock,
  InMemoryOrderRepository,
  fakeDeps,
} from "../testing/fakes";
import { OutOfStockError, PaymentDeclinedError } from "./errors";
import { OrderService } from "./orderService";

describe("OrderService.placeOrder", () => {
  // Chapter 4: a spy at the boundary Parcelo owns
  it("charges the quoted total with the request's token",
    async () => {
      const chargeSpy = vi.fn().mockResolvedValue({
        status: "approved",
        providerRef: "pi_1",
      });
      const service = new OrderService({
        ...fakeDeps(),
        pricing: { quote: async () => ({ totalCents: 2999 }) },
        gateway: { charge: chargeSpy } as unknown as PaymentGateway,
      });
      await service.placeOrder(anOrderRequest().build());
      expect(chargeSpy).toHaveBeenCalledWith(2999, "tok_test");
    });

  // Chapter 6 (gateway and clock arrived in Chapter 7, so the
  // repo version spreads fakeDeps() for them)
  it("rejects and saves nothing when stock can't be reserved",
    async () => {
      const orders = new InMemoryOrderRepository();
      const service = new OrderService({
        ...fakeDeps(),
        orders,
        pricing: { quote: async () => ({ totalCents: 5400 }) },
        inventory: { tryReserve: async () => false },
        ids: { next: () => "ord_1" },
      });
      const threeBags = anOrderRequest()
        .withItems([{ sku: "ETHIOPIA-250", quantity: 3 }])
        .build();

      await expect(service.placeOrder(threeBags))
        .rejects.toThrow(OutOfStockError);
      expect(await orders.findById("ord_1")).toBeNull();
    });

  // Chapter 7
  it("records the order date at time of creation", async () => {
    const at = new Date("2026-03-14T23:59:59.999Z");
    const service = new OrderService({
      ...fakeDeps(),
      clock: new FixedClock(at),
    });

    const order = await service.placeOrder(
      anOrderRequest().build(),
    );

    expect(order.createdAt).toEqual(at);
  });

  // Chapter 14, week 2
  it("saves the order after a successful charge", async () => {
    const repo = new InMemoryOrderRepository();
    const gateway = new FakePaymentGateway();
    const service = new OrderService({
      ...fakeDeps(),
      orders: repo,
      gateway,
    });

    const order = await service.placeOrder(
      anOrderRequest().build(),
    );

    expect(await repo.findById(order.id)).not.toBeNull();
  });

  // Declines are a ChargeResult (Chapter 4); placeOrder turns
  // them into a domain error and saves nothing.
  it("saves nothing when the charge is declined", async () => {
    const orders = new InMemoryOrderRepository();
    const service = new OrderService({
      ...fakeDeps(),
      orders,
      gateway: new FakePaymentGateway(true),
    });

    await expect(service.placeOrder(anOrderRequest().build()))
      .rejects.toThrow(PaymentDeclinedError);
    expect(await orders.findById("ord_1")).toBeNull();
  });
});
