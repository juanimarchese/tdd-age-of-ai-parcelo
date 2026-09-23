// Chapter 3. One builder, sensible defaults, override what matters.
// The result is both a DiscountInput and a storable Order.
class OrderBuilder {
  private order = {
    id: "ord_1",
    customerId: "c-1",
    items: [{ sku: "ETHIOPIA-250", quantity: 1 }],
    bagCount: 1,
    subtotalCents: 1500,
    isSubscriber: false,
    promoCode: null as string | null,
    status: "placed" as const,
    totalCents: 1500,
    createdAt: new Date("2026-01-01"),
  };

  withId(id: string) {
    this.order.id = id;
    return this;
  }
  withItems(bags: number) {
    this.order.items = [
      { sku: "ETHIOPIA-250", quantity: bags },
    ];
    this.order.bagCount = bags;
    return this;
  }
  withSubtotalCents(cents: number) {
    this.order.subtotalCents = cents;
    return this;
  }
  forSubscriber() {
    this.order.isSubscriber = true;
    return this;
  }
  withPromoCode(code: string) {
    this.order.promoCode = code;
    return this;
  }
  build() {
    return { ...this.order };
  }
}

export const anOrder = () => new OrderBuilder();
