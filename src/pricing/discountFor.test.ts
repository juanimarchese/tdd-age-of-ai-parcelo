import { describe, it, expect } from "vitest";
import { anOrder } from "../testing/builders";
import { discountFor } from "./discountFor";

describe("discountFor (Chapter 2)", () => {
  it("gives no discount for a single bag", () => {
    const result = discountFor({
      bagCount: 1,
      isSubscriber: false,
      promoCode: null,
      subtotalCents: 1500,
    });
    expect(result).toBe(0);
  });

  it("gives 10% off for exactly 3 bags", () => {
    expect(discountFor({ bagCount: 3, isSubscriber: false,
      promoCode: null, subtotalCents: 3000 })).toBe(300);
  });

  it("gives 10% off for more than 3 bags", () => {
    expect(discountFor({ bagCount: 5, isSubscriber: false,
      promoCode: null, subtotalCents: 5000 })).toBe(500);
  });

  it("rounds the discount down to the nearest cent", () => {
    const result = discountFor({
      bagCount: 3, isSubscriber: false, promoCode: null,
      // 999 cents at 1000 bps = 99.9 cents -> 99, not 100
      subtotalCents: 999,
    });
    expect(result).toBe(99);
  });

  it(
    "caps the total discount at 20% even when rules add to more",
    () => {
      const result = discountFor({
        bagCount: 3, isSubscriber: true, promoCode: "ROAST10",
        subtotalCents: 10000, // 10 + 5 + 10 = 25%, capped to 20%
      });
      expect(result).toBe(2000);
    },
  );
});

describe("discountFor with the builder (Chapter 3)", () => {
  it("gives no discount for fewer than 3 bags", () => {
    const order = anOrder().withItems(2).build();
    expect(discountFor(order)).toBe(0);
  });

  it("gives 10% off for 3 or more bags", () => {
    const order = anOrder()
      .withItems(3)
      .withSubtotalCents(3000)
      .build();
    expect(discountFor(order)).toBe(300);
  });

  it("subscriber gets 15% off with 3+ bags", () => {
    // Arrange
    const order = anOrder()
      .withItems(3)
      .withSubtotalCents(3000)
      .forSubscriber()
      .build();

    // Act
    const discount = discountFor(order);

    // Assert
    expect(discount).toBe(450);
  });

  it("caps combined discounts at 20%", () => {
    const order = anOrder()
      .withItems(3)
      .withSubtotalCents(10_000)
      .forSubscriber()
      .withPromoCode("ROAST10")
      .build();

    // 20% of $100.00, not 25%
    expect(discountFor(order)).toBe(2000);
  });

  it("gives 10% off for 5 bags, non-subscriber", () => {
    const order = anOrder()
      .withItems(5)
      .withSubtotalCents(5000)
      .build();
    expect(discountFor(order)).toBe(500);
  });

  it("gives 15% off for 5 bags, subscriber", () => {
    const order = anOrder()
      .withItems(5)
      .withSubtotalCents(5000)
      .forSubscriber()
      .build();
    expect(discountFor(order)).toBe(750);
  });
});

describe("discountFor behavior (Chapters 8, 11, 12)", () => {
  it("caps a subscriber's 3-bag ROAST10 order at 20%", () => {
    // Ch 8: coupled to behavior, survives the refactor
    const order = anOrder()
      .withItems(3)
      .forSubscriber()
      .withPromoCode("ROAST10")
      .withSubtotalCents(3000)
      .build();
    expect(discountFor(order)).toBe(600); // capped at 20%
  });

  it("gives 5 bags + subscriber + ROAST10 exactly 20%", () => {
    // Ch 11: the "before" assertion an agent weakened
    expect(discountFor({ bagCount: 5, isSubscriber: true,
      promoCode: "ROAST10", subtotalCents: 10000 })).toBe(2000);
  });

  it("applies the bulk discount at exactly 3 bags", () => {
    // Ch 12: the test that kills the >= to > mutant
    expect(discountFor({ bagCount: 3, isSubscriber: false,
      promoCode: null, subtotalCents: 3000 })).toBe(300);
  });
});
