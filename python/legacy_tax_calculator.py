"""Chapter 9: a line-for-line port of legacyTaxCalculator.ts."""
import math


def _js_round(x: float) -> int:
    # JavaScript's Math.round (half up), not Python's round().
    return math.floor(x + 0.5)


def calc_tax(o: dict, st: str, cty: str | None = None) -> int:
    r = 0.0
    if st == "CA":
        r = 0.0725
        if cty == "LA":
            r += 0.01
        if o.get("type") == "food" and o.get("roasted") is not True:
            r = 0
    elif st == "CO":
        r = 0.029
        if cty == "Boulder" and o.get("type") == "food":
            r = 0
    elif st == "NY":
        r = 0.08875 if o["subtotal"] > 11000 else 0.04
    # TODO: fix this for subscriptions, see ticket PARC-448
    if o.get("isSubscription") and st != "NY":
        r = r * 0.5
    return _js_round(o["subtotal"] * r)
