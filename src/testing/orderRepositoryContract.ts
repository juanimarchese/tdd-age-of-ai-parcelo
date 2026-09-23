import { beforeEach, describe, expect, it } from "vitest";
import type { OrderRepository } from "../orders";
import { anOrder } from "./builders";

// Chapter 7: one behavioral spec, run against every implementation.
export function orderRepositoryContractTests(
  makeRepository: () => Promise<OrderRepository>
) {
  describe("OrderRepository contract", () => {
    let repo: OrderRepository;

    beforeEach(async () => {
      repo = await makeRepository();
    });

    it("returns null for a missing order", async () => {
      expect(await repo.findById("missing")).toBeNull();
    });

    it("returns a saved order by id", async () => {
      const order = anOrder().build();
      await repo.save(order);
      expect(await repo.findById(order.id)).toEqual(order);
    });
  });
}
