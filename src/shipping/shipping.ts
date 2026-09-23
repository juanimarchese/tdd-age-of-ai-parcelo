export interface ShippingInput {
  country: string;
  subtotalCents: number;
  weightGrams: number;
}

export function shippingCost({
  country,
  subtotalCents,
  weightGrams,
}: ShippingInput): number {
  if (weightGrams < 0) {
    throw new RangeError("weightGrams must be >= 0");
  }
  if (country === "US") return subtotalCents >= 5000 ? 0 : 599;
  return 1200 + Math.ceil(weightGrams / 1000) * 400;
}
