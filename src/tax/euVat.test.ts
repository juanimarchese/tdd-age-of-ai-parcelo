import { describe, it, expect } from "vitest";
import { calcTaxWithEuSupport, euVatRate } from "./euVat";

// Chapter 9: the sprout is test-driven; the wrap leaves the
// legacy path alone.
describe("euVatRate", () => {
  it("returns 0 for a non-EU country", () => {
    expect(euVatRate("US", 5000)).toBe(0);
  });

  it("returns the country's rate", () => {
    expect(euVatRate("DE", 5000)).toBe(0.19);
  });
});

describe("calcTaxWithEuSupport", () => {
  it("applies VAT for EU countries", () => {
    expect(calcTaxWithEuSupport({ subtotal: 1000 }, "DE"))
      .toBe(190);
  });

  it("falls through to the legacy calculator", () => {
    expect(calcTaxWithEuSupport(
      { subtotal: 2000, type: "food", roasted: true },
      "CA",
      "LA",
    )).toBe(165);
  });
});
