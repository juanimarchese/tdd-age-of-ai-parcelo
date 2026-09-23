import fc from "fast-check";
import { describe, it, expect } from "vitest";
import { discountFor, orderTotal } from "../src/pricing";
import { anOrderArbitrary } from "../src/testing/arbitraries";

// Chapters 12 and 14
describe("discount properties", () => {
  it("never discounts more than 20% of the subtotal", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        fc.boolean(),
        fc.boolean(),
        fc.integer({ min: 100, max: 1_000_000 }),
        (bagCount, isSubscriber, hasPromo, subtotalCents) => {
          const discount = discountFor({
            bagCount,
            isSubscriber,
            promoCode: hasPromo ? "ROAST10" : null,
            subtotalCents,
          });
          const capCents = Math.floor(
            (subtotalCents * 2_000) / 10_000,
          );
          expect(discount).toBeLessThanOrEqual(capCents);
        }
      )
    );
  });

  it("total always reconciles with its parts", () => {
    fc.assert(
      fc.property(anOrderArbitrary(), (order) => {
        const total = order.lines
          .reduce((s, l) => s + l.lineTotalCents, 0)
          - order.discountCents + order.shippingCents;
        expect(orderTotal(order)).toBe(total);
      })
    );
  });
});
