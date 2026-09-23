import { describe, it, expect } from "vitest";
import { shippingCost } from "./shipping";

// Chapter 10: Lena's test file, written before the code.
const us = (subtotalCents: number) =>
  ({ country: "US", subtotalCents, weightGrams: 800 });
const de = (weightGrams: number) =>
  ({ country: "DE", subtotalCents: 9000, weightGrams });

describe("shippingCost", () => {
  it("is free for US orders over $50", () => {
    expect(shippingCost(us(7500))).toBe(0);
  });

  it("is free for US orders of exactly $50", () => {
    expect(shippingCost(us(5000))).toBe(0);
  });

  it("charges $5.99 for US orders under $50", () => {
    expect(shippingCost(us(4999))).toBe(599);
  });

  it("charges international $12 plus $4 per started kg", () => {
    expect(shippingCost(de(1200))).toBe(2000);
  });

  it("charges one kg for exactly 1000 grams", () => {
    expect(shippingCost(de(1000))).toBe(1600);
  });

  it("rejects negative weights", () => {
    const order = {
      country: "US",
      subtotalCents: 1000,
      weightGrams: -1,
    };
    expect(() => shippingCost(order)).toThrow(RangeError);
  });

  // Chapter 14, week 1
  it("charges $5.99 for a US order under $50", () => {
    expect(shippingCost({
      country: "US", subtotalCents: 4999, weightGrams: 500,
    })).toBe(599);
  });

  // Chapter 11's weak assertion, pinned to the real number
  it("charges DE 1800 g as two started kg", () => {
    const cost = shippingCost({
      country: "DE", subtotalCents: 3000, weightGrams: 1800,
    });
    expect(cost).toBe(2000);
  });
});
