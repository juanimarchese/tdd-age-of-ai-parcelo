export interface Line {
  unitPriceCents: number;
  quantity: number;
}

export function lineTotal({
  quantity,
  unitPriceCents,
}: Line): number {
  if (quantity < 0) {
    throw new RangeError("quantity must not be negative");
  }
  return quantity * unitPriceCents;
}
