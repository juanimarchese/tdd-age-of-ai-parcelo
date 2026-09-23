// Chapter 9: the file nobody wants to touch. Reproduced as-is,
// warts included; the tests characterize it, they don't bless it.
export function calcTax(o: any, st: string, cty?: string) {
  let r = 0;
  if (st === "CA") {
    r = 0.0725;
    if (cty === "LA") r += 0.01;
    if (o.type === "food" && o.roasted !== true) r = 0;
  } else if (st === "CO") {
    r = 0.029;
    if (cty === "Boulder" && o.type === "food") r = 0;
  } else if (st === "NY") {
    r = o.subtotal > 11000 ? 0.08875 : 0.04;
  }
  // TODO: fix this for subscriptions, see ticket PARC-448
  if (o.isSubscription && st !== "NY") r = r * 0.5;
  return Math.round(o.subtotal * r);
}
