// Chapter 6: the real PricingPolicy, built from Chapter 2's rules.
import type { OrderRequest } from "../orders/Order";
import type { PricingPolicy } from "../orders/ports";
import { discountFor } from "./discountFor";
import { lineTotal } from "./lineTotal";

export class CatalogPricing implements PricingPolicy {
  constructor(private readonly prices: Map<string, number>) {}

  async quote(request: OrderRequest) {
    const subtotalCents = request.items.reduce(
      (sum, item) =>
        sum + lineTotal({
          quantity: item.quantity,
          unitPriceCents: this.priceOf(item.sku),
        }),
      0,
    );
    const bagCount = request.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const discount = discountFor({
      bagCount,
      isSubscriber: false,
      promoCode: null,
      subtotalCents,
    });
    return { totalCents: subtotalCents - discount };
  }

  private priceOf(sku: string): number {
    const price = this.prices.get(sku);
    if (price === undefined) throw new Error(`unknown sku ${sku}`);
    return price;
  }
}
