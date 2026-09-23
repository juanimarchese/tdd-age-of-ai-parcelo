import { describe, it, expect } from "vitest";
import { anOrder } from "../builders";
import { orderRepositoryContractTests } from "../orderRepositoryContract";
import { InMemoryOrderRepository } from "./InMemoryOrderRepository";

// Chapter 4
describe("InMemoryOrderRepository", () => {
  it("stores an order and retrieves it by id", async () => {
    const repo = new InMemoryOrderRepository();
    await repo.save(anOrder().withId("ord_1").build());
    expect((await repo.findById("ord_1"))?.id).toBe("ord_1");
  });
});

// Chapter 7
orderRepositoryContractTests(
  async () => new InMemoryOrderRepository(),
);
