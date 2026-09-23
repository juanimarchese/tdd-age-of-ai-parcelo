export interface DiscountInput {
  bagCount: number;
  isSubscriber: boolean;
  promoCode: string | null;
  subtotalCents: number;
}

type DiscountRule = (input: DiscountInput) => number;

const bulkDiscount: DiscountRule = (i) =>
  i.bagCount >= 3 ? 1000 : 0;
const subscriberDiscount: DiscountRule = (i) =>
  i.isSubscriber ? 500 : 0;
const promoDiscount: DiscountRule = (i) =>
  i.promoCode === "ROAST10" ? 1000 : 0;

const RULES: DiscountRule[] = [
  bulkDiscount,
  subscriberDiscount,
  promoDiscount,
];

const CAP_BP = 2_000; // 20%

export function discountFor(input: DiscountInput): number {
  const rateBp = RULES.reduce(
    (sum, rule) => sum + rule(input),
    0,
  );
  const cappedBp = Math.min(rateBp, CAP_BP);
  return Math.floor((input.subtotalCents * cappedBp) / 10_000);
}
