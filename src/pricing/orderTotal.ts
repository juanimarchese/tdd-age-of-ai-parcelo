// Chapter 12: the shape the reconciliation properties work on.
export interface LineItem {
  lineTotalCents: number;
}

export interface PricedOrder {
  lines: LineItem[];
  discountCents: number;
  shippingCents: number;
  chargeCents: number;
}

export function orderTotal(order: PricedOrder): number {
  const subtotal = order.lines
    .reduce((s, l) => s + l.lineTotalCents, 0);
  return subtotal - order.discountCents + order.shippingCents;
}
