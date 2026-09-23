// Chapter 9: sprout and wrap. New code, test-driven, beside the
// legacy function instead of inside it.
import { calcTax } from "./legacyTaxCalculator";

export interface TaxableOrder {
  subtotal: number;
  type?: string;
  roasted?: boolean;
  isSubscription?: boolean;
}

// Illustrative figures, not tax advice.
const EU_VAT_RATES: Record<string, number> = { DE: 0.19, FR: 0.2 };
const EU_VAT_THRESHOLDS: Record<string, number> = { DE: 0, FR: 0 };

export const isEuCountry = (code: string) => code in EU_VAT_RATES;

export function euVatRate(
  countryCode: string,
  subtotalCents: number,
): number {
  const threshold = EU_VAT_THRESHOLDS[countryCode];
  if (threshold === undefined) return 0;
  if (subtotalCents < threshold) return 0;
  return EU_VAT_RATES[countryCode];
}

export function calcTaxWithEuSupport(
  o: TaxableOrder,
  st: string,
  cty?: string,
): number {
  if (isEuCountry(st)) {
    return Math.round(o.subtotal * euVatRate(st, o.subtotal));
  }
  return calcTax(o, st, cty); // legacy path untouched
}
