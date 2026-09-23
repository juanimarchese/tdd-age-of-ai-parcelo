"""Chapter 10."""
import math


def shipping_cost(country: str, subtotal_cents: int, *,
                  weight_grams: int) -> int:
    if weight_grams < 0:
        raise ValueError("weight_grams must be >= 0")
    if country == "US":
        return 0 if subtotal_cents >= 5000 else 599
    return 1200 + math.ceil(weight_grams / 1000) * 400
