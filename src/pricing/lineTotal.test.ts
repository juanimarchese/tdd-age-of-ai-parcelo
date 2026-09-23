import { describe, it, expect } from "vitest";
import { lineTotal } from "./lineTotal";

// Chapters 1 and 2
describe("lineTotal", () => {
  it("multiplies unit price by quantity", () => {
    expect(
      lineTotal({ unitPriceCents: 1450, quantity: 3 }),
    ).toBe(4350);
  });

  it("returns 0 for a zero quantity", () => {
    expect(lineTotal({ quantity: 0, unitPriceCents: 1200 }))
      .toBe(0);
  });

  it("throws RangeError for a negative quantity", () => {
    expect(() =>
      lineTotal({ quantity: -1, unitPriceCents: 1200 }),
    ).toThrow(new RangeError("quantity must not be negative"));
  });
});
