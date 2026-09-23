import fc from "fast-check";
import { orderTotal, type PricedOrder } from "../pricing";

// Chapter 12: random priced orders. The discount never exceeds
// the subtotal, and chargeCents is what the customer paid.
export const anOrderArbitrary = (): fc.Arbitrary<PricedOrder> =>
  fc
    .record({
      lines: fc.array(
        fc.record({
          lineTotalCents: fc.integer({ min: 1, max: 100_000 }),
        }),
        { minLength: 1, maxLength: 12 },
      ),
      discountPct: fc.integer({ min: 0, max: 20 }),
      shippingCents: fc.constantFrom(0, 599, 1600),
    })
    .map(({ lines, discountPct, shippingCents }) => {
      const subtotal = lines
        .reduce((s, l) => s + l.lineTotalCents, 0);
      const discountCents = Math.floor(
        (subtotal * discountPct) / 100);
      const order = { lines, discountCents, shippingCents };
      return {
        ...order,
        chargeCents: orderTotal({ ...order, chargeCents: 0 }),
      };
    });
