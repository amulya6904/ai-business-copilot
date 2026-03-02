from datetime import date, timedelta
from core.analytics.kpi_engine import run_metric

def iso(d: date) -> str:
    return d.isoformat()

def compare_ranges(metric_name: str, start_a: date, end_a: date, start_b: date, end_b: date):
    cols_a, rows_a = run_metric(metric_name, iso(start_a), iso(end_a))
    cols_b, rows_b = run_metric(metric_name, iso(start_b), iso(end_b))

    # If metric is a single-row metric (like aov_overall)
    if len(rows_a) == 1 and len(rows_b) == 1:
        a = dict(zip(cols_a, rows_a[0]))
        b = dict(zip(cols_b, rows_b[0]))
        return {"period_a": a, "period_b": b}

    return {"period_a_rows": rows_a[:10], "period_b_rows": rows_b[:10]}

if __name__ == "__main__":
    # Example: compare Jan 2017 vs Jan 2016 revenue_by_category
    from datetime import date
    out = compare_ranges("revenue_by_category", date(2017,1,1), date(2017,1,31), date(2016,1,1), date(2016,1,31))
    print(out)