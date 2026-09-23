# Chapter 11: the hollow green, on purpose. This test passes
# no matter what discount_for does. Don't copy it.
import pricing
from builders import an_order

def test_discount_cap(monkeypatch):
    monkeypatch.setattr(
        "pricing.discount_for", lambda order: 2000
    )
    # tests the patch, not the code
    assert pricing.discount_for(an_order(bag_count=5)) == 2000
