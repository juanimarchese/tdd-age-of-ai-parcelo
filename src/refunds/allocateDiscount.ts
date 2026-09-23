import type { LineItem } from "../pricing";

// Chapter 12: the other half of Priya's bug. Largest-remainder
// (Hamilton) allocation: shares always sum to discountCents.
export function allocateDiscount(
  lines: LineItem[],
  discountCents: number,
): number[] {
  const subtotal = lines
    .reduce((s, l) => s + l.lineTotalCents, 0);
  if (subtotal === 0) return lines.map(() => 0);
  const exact = lines.map(
    (l) => (l.lineTotalCents * discountCents) / subtotal);
  const shares = exact.map(Math.floor);
  const remainder =
    discountCents - shares.reduce((a, b) => a + b, 0);

  exact
    .map((value, i) => ({ i, frac: value - shares[i] }))
    .sort((a, b) => b.frac - a.frac)
    .slice(0, remainder)
    .forEach(({ i }) => shares[i]++);

  return shares;
}

// The allocator Priya's agent wrote: each line rounded on its own.
// Kept only so the property test can show it failing.
export function naiveAllocateDiscount(
  lines: LineItem[],
  discountCents: number,
): number[] {
  const subtotal = lines
    .reduce((s, l) => s + l.lineTotalCents, 0);
  if (subtotal === 0) return lines.map(() => 0);
  return lines.map((l) =>
    Math.floor((l.lineTotalCents * discountCents) / subtotal));
}
