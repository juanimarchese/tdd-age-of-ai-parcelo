# Chapter 9. Run pytest from the python/ directory.
import json
from pathlib import Path
from legacy_tax_calculator import calc_tax

def test_calc_tax_matches_golden_file():
    golden_dir = Path("tests/golden")
    scenarios = json.loads(
        (golden_dir / "tax_scenarios.json").read_text()
    )
    actual = [
        calc_tax(s["order"], s["state"], s.get("county"))
        for s in scenarios
    ]
    golden = json.loads(
        (golden_dir / "tax_expected.json").read_text()
    )
    # characterization: current behavior,
    # not necessarily correct
    assert actual == golden
