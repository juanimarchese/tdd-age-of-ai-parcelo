import fc from "fast-check";
import { describe, it, expect } from "vitest";
import { calcTax } from "./legacyTaxCalculator";

describe("calcTax (characterization)", () => {
  // characterization: current behavior, not necessarily correct
  it("adds 1% LA county to the 7.25% CA rate", () => {
    const result = calcTax(
      { subtotal: 2000, type: "food", roasted: true },
      "CA",
      "LA",
    );
    expect(result).toBe(165); // 8.25% of 2000, rounded
  });

  // characterization: current behavior, not necessarily correct
  it("halves the rate for subscriptions outside NY", () => {
    // PARC-448 says this is wrong, but it's what ships today
    const result = calcTax(
      { subtotal: 3000, type: "gear", isSubscription: true },
      "CO",
    );
    expect(result).toBe(44); // 2.9% halved to 1.45%, rounded
  });
});

const scenarios = [
  { subtotal: 2000, type: "food", roasted: true,
    st: "CA", cty: "LA" },
  { subtotal: 3000, type: "gear", isSubscription: true,
    st: "CO" },
  { subtotal: 12000, type: "gear", st: "NY" },
  { subtotal: 500, type: "food", roasted: false, st: "CA" },
];

it("matches approved tax output for known scenarios", () => {
  const output = scenarios.map((s) => calcTax(s, s.st, s.cty));
  expect(output).toMatchSnapshot();
});

// Chapter 13
it("never charges tax that exceeds 15% of the taxable amount",
  () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1_000_000 }),
        (amountCents) => {
          const item = {
            subtotal: amountCents, type: "food", roasted: true,
          };
          const tax = calcTax(item, "CA", "LA");
          const cap = Math.floor(amountCents * 0.15);
          expect(tax).toBeLessThanOrEqual(cap);
        },
      ),
    );
  });
