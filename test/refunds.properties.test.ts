import fc from "fast-check";
import { describe, it, expect } from "vitest";
import type { LineItem } from "../src/pricing";
import {
  allocateDiscount,
  naiveAllocateDiscount,
} from "../src/refunds";
import { anOrderArbitrary } from "../src/testing/arbitraries";

// Chapter 12: the other half of Priya's bug.
const neverOverRefunds = (
  allocate: (lines: LineItem[], d: number) => number[],
) =>
  fc.property(anOrderArbitrary(), (order) => {
    const shares = allocate(order.lines, order.discountCents);
    // refund every line, one partial refund at a time
    const refundTotal = order.lines.reduce(
      (sum, l, i) => sum + l.lineTotalCents - shares[i], 0);
    expect(refundTotal)
      .toBeLessThanOrEqual(order.chargeCents);
  });

describe("allocateDiscount", () => {
  it("partial refunds never exceed the original charge", () => {
    fc.assert(neverOverRefunds(allocateDiscount));
  });

  // The shrunk counterexample Chapter 12 walks through
  const shrunk = [1, 5].map((c) => ({ lineTotalCents: c }));

  it("gives the leftover cent to the largest remainder", () => {
    expect(allocateDiscount(shrunk, 1)).toEqual([0, 1]);
  });

  it("the naive allocator fails the same property", () => {
    const result = fc.check(neverOverRefunds(naiveAllocateDiscount));
    expect(result.failed).toBe(true);
  });

  it("naive rounding over-refunds the shrunk example", () => {
    const shares = naiveAllocateDiscount(shrunk, 1);
    const refund = 6 - shares.reduce((a, b) => a + b, 0);
    expect(refund).toBe(6); // but the charge was 5
  });
});
