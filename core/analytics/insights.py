from __future__ import annotations
from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from typing import Dict, List, Tuple

from core.analytics.kpi_engine import run_metric

def iso(d: date) -> str:
    return d.isoformat()

def to_decimal(x) -> Decimal:
    return x if isinstance(x, Decimal) else Decimal(str(x))

def pct_change(a: Decimal, b: Decimal) -> Decimal:
    # change from b -> a
    if b == 0:
        return Decimal("0")
    return (a - b) / b * Decimal("100")

def sum_revenue(rows: List[Tuple]) -> Decimal:
    # rows = [(dim, revenue), ...]
    s = Decimal("0")
    for r in rows:
        s += to_decimal(r[1])
    return s

def top_contributors(delta_map: Dict[str, Decimal], top_n: int = 5):
    return sorted(delta_map.items(), key=lambda x: abs(x[1]), reverse=True)[:top_n]

@dataclass
class Insight:
    title: str
    summary: str
    drivers: List[str]

def insight_to_dict(ins: Insight):
    return {
        "title": ins.title,
        "summary": ins.summary,
        "drivers": ins.drivers
    }

def compare_dim(metric_name: str, start_a: date, end_a: date, start_b: date, end_b: date, label: str) -> Tuple[str, List[str]]:
    _, rows_a = run_metric(metric_name, iso(start_a), iso(end_a))
    _, rows_b = run_metric(metric_name, iso(start_b), iso(end_b))

    map_a = {str(k): to_decimal(v) for k, v in rows_a}
    map_b = {str(k): to_decimal(v) for k, v in rows_b}

    # unified keys
    keys = set(map_a.keys()) | set(map_b.keys())
    delta = {k: map_a.get(k, Decimal("0")) - map_b.get(k, Decimal("0")) for k in keys}

    top = top_contributors(delta, top_n=5)
    lines = []
    for k, d in top:
        sign = "+" if d >= 0 else ""
        lines.append(f"{label} '{k}': {sign}{d:.2f}")
    return metric_name, lines

def generate_revenue_insight(start_a: date, end_a: date, start_b: date, end_b: date) -> Insight:
    # overall revenue (sum daily)
    _, daily_a = run_metric("revenue_daily", iso(start_a), iso(end_a))
    _, daily_b = run_metric("revenue_daily", iso(start_b), iso(end_b))
    rev_a = sum(to_decimal(v) for _, v in daily_a)
    rev_b = sum(to_decimal(v) for _, v in daily_b)

    change_abs = rev_a - rev_b
    change_pct = pct_change(rev_a, rev_b)
    direction = "increased" if change_abs >= 0 else "decreased"

    title = f"Revenue {direction} by {change_abs:.2f} ({change_pct:.2f}%)"
    summary = f"Period A ({start_a} to {end_a}) revenue={rev_a:.2f}; Period B ({start_b} to {end_b}) revenue={rev_b:.2f}."

    drivers = []
    # drilldowns
    _, d1 = compare_dim("revenue_by_category", start_a, end_a, start_b, end_b, "Category")
    _, d2 = compare_dim("revenue_by_region", start_a, end_a, start_b, end_b, "Region")
    _, d3 = compare_dim("revenue_by_sub_category", start_a, end_a, start_b, end_b, "Sub-category")

    drivers.extend(["Top drivers (by absolute revenue delta):"])
    drivers.extend(d1)
    drivers.extend(d2)
    drivers.extend(d3)

    return Insight(title=title, summary=summary, drivers=drivers)

if __name__ == "__main__":
    ins = generate_revenue_insight(
        date(2017,1,1), date(2017,1,31),
        date(2016,1,1), date(2016,1,31)
    )
    import json
    print(json.dumps(insight_to_dict(ins), indent=2))
