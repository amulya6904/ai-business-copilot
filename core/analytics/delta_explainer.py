from __future__ import annotations

from datetime import date
from decimal import Decimal

from core.analytics.insights import compare_dim
from core.analytics.kpi_engine import METRIC_ALIASES
from core.analytics.kpi_engine import run_metric


DRIVER_METRICS = {
    "revenue": [
        ("revenue_by_category", "Category"),
        ("revenue_by_region", "Region"),
        ("revenue_by_sub_category", "Sub-category"),
    ],
    "revenue_daily": [
        ("revenue_by_category", "Category"),
        ("revenue_by_region", "Region"),
        ("revenue_by_sub_category", "Sub-category"),
    ],
    "revenue_by_category": [("revenue_by_category", "Category")],
    "revenue_by_region": [("revenue_by_region", "Region")],
    "revenue_by_sub_category": [("revenue_by_sub_category", "Sub-category")],
}


def _to_decimal(value) -> Decimal:
    return value if isinstance(value, Decimal) else Decimal(str(value))


def _pct_change(current: Decimal, previous: Decimal) -> Decimal:
    if previous == 0:
        return Decimal("0")
    return (current - previous) / previous * Decimal("100")


def _metric_label(metric: str) -> str:
    if metric == "revenue_daily":
        return "Revenue"
    return metric.replace("_", " ").capitalize()


def _sum_metric(rows) -> Decimal:
    total = Decimal("0")
    for row in rows:
        total += _to_decimal(row[-1])
    return total


def _parse_date(value: str) -> date:
    return date.fromisoformat(value)


def _build_drivers(metric: str, start_a: date, end_a: date, start_b: date, end_b: date) -> list[str]:
    drivers: list[str] = []

    for driver_metric, label in DRIVER_METRICS.get(metric, []):
        _, lines = compare_dim(driver_metric, start_a, end_a, start_b, end_b, label)
        drivers.extend(lines)

    return drivers


def explain_delta(
    metric: str,
    period_a_start: str,
    period_a_end: str,
    period_b_start: str,
    period_b_end: str,
) -> dict:
    resolved_metric = METRIC_ALIASES.get(metric, metric)
    start_a = _parse_date(period_a_start)
    end_a = _parse_date(period_a_end)
    start_b = _parse_date(period_b_start)
    end_b = _parse_date(period_b_end)

    _, rows_a = run_metric(resolved_metric, period_a_start, period_a_end)
    _, rows_b = run_metric(resolved_metric, period_b_start, period_b_end)

    total_a = _sum_metric(rows_a)
    total_b = _sum_metric(rows_b)
    change_abs = total_a - total_b
    change_pct = _pct_change(total_a, total_b)
    direction = "increased" if change_abs >= 0 else "decreased"

    return {
        "title": f"{_metric_label(resolved_metric)} {direction} by {change_abs:.2f} ({change_pct:.2f}%)",
        "summary": (
            f"Period A ({period_a_start} to {period_a_end}) value={total_a:.2f}; "
            f"Period B ({period_b_start} to {period_b_end}) value={total_b:.2f}."
        ),
        "drivers": _build_drivers(metric, start_a, end_a, start_b, end_b),
    }
