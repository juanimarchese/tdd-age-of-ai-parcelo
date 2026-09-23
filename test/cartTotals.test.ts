// A "unit" test that exercises three collaborating pieces
// (lineTotal, discountFor, and the cart total) with no
// test doubles at all. (Chapter 5)
import { describe, it, expect } from "vitest";
import { lineTotal, discountFor } from "../src/pricing";

describe("cart totals", () => {
  it("applies a 10% bag discount to the summed lines", () => {
    const lines = [
      { unitPriceCents: 1200, quantity: 3 },
      { unitPriceCents: 900, quantity: 1 },
    ];
    const subtotal = lines.reduce(
      (sum, l) => sum + lineTotal(l),
      0,
    );
    const bagCount = lines.reduce(
      (sum, l) => sum + l.quantity,
      0,
    );
    const discount = discountFor({
      bagCount,
      isSubscriber: false,
      promoCode: null,
      subtotalCents: subtotal,
    });
    expect(subtotal).toBe(4500);
    expect(discount).toBe(450); // 10% of 4500, rounded down
  });
});
