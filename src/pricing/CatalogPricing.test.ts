import { describe, it, expect } from "vitest";
import { anOrderRequest } from "../testing/builders";
import { CatalogPricing } from "./CatalogPricing";

describe("CatalogPricing (Chapter 6)", () => {
  const pricing = new CatalogPricing(
    new Map([["ETHIOPIA-250", 1800]]),
  );

  it("charges full price below the bag threshold", async () => {
    const request = anOrderRequest().build();
    expect(await pricing.quote(request))
      .toEqual({ totalCents: 1800 });
  });

  it("takes 10% off three bags, reusing discountFor", async () => {
    const request = anOrderRequest()
      .withItems([{ sku: "ETHIOPIA-250", quantity: 3 }])
      .build();
    expect(await pricing.quote(request))
      .toEqual({ totalCents: 4860 });
  });

  it("rejects a SKU that isn't in the catalog", async () => {
    const request = anOrderRequest()
      .withItems([{ sku: "NOPE-250", quantity: 1 }])
      .build();
    await expect(pricing.quote(request))
      .rejects.toThrow("unknown sku NOPE-250");
  });
});
