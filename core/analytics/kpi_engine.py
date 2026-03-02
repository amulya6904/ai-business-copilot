import os
from functools import lru_cache

import pandas as pd
import yaml
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from core.db import get_engine

CATALOG_PATH = os.getenv("METRIC_CATALOG_PATH", "core/catalog/metrics.yaml")
CSV_PATH = os.getenv("SUPERSTORE_CSV_PATH", "data/raw/Sample - Superstore.csv")
METRIC_ALIASES = {
    "revenue": "revenue_daily",
}

def load_catalog():
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def catalog_metrics(catalog):
    if isinstance(catalog, dict):
        metrics = catalog.get("metrics", [])
    elif isinstance(catalog, list):
        metrics = catalog
    else:
        raise TypeError(f"Unsupported catalog type: {type(catalog).__name__}")

    if not isinstance(metrics, list):
        raise TypeError("Catalog metrics must be a list")
    return metrics

def get_metric(catalog, name: str):
    resolved_name = METRIC_ALIASES.get(name, name)
    for m in catalog_metrics(catalog):
        if m["name"] == resolved_name:
            return m
    raise KeyError(f"Metric not found: {name}")


@lru_cache(maxsize=1)
def _load_superstore_frame():
    df = pd.read_csv(CSV_PATH, encoding="latin1")
    df["Order Date"] = pd.to_datetime(df["Order Date"], format="%m/%d/%Y", errors="coerce")
    df["Sales"] = pd.to_numeric(df["Sales"], errors="coerce").fillna(0.0)
    df["Region"] = df["Region"].fillna("Unknown")
    df["Category"] = df["Category"].fillna("Unknown")
    df["Sub-Category"] = df["Sub-Category"].fillna("Unknown")
    return df


def _run_metric_from_csv(metric_name: str, start_date: str, end_date: str):
    resolved_name = METRIC_ALIASES.get(metric_name, metric_name)
    if resolved_name not in {
        "revenue_daily",
        "revenue_by_category",
        "revenue_by_region",
        "revenue_by_sub_category",
    }:
        raise KeyError(f"Metric not found: {metric_name}")

    df = _load_superstore_frame()
    start = pd.to_datetime(start_date)
    end = pd.to_datetime(end_date)
    filtered = df[df["Order Date"].between(start, end)].copy()

    if resolved_name == "revenue_daily":
        grouped = (
            filtered.groupby("Order Date", dropna=False)["Sales"]
            .sum()
            .sort_index()
            .reset_index()
        )
        grouped["Order Date"] = grouped["Order Date"].dt.date
        cols = ["order_date", "revenue"]
        rows = [tuple(row) for row in grouped.itertuples(index=False, name=None)]
        return cols, rows

    dimension_map = {
        "revenue_by_category": ("Category", "category"),
        "revenue_by_region": ("Region", "region"),
        "revenue_by_sub_category": ("Sub-Category", "sub_category"),
    }
    source_col, out_col = dimension_map[resolved_name]
    grouped = (
        filtered.groupby(source_col, dropna=False)["Sales"]
        .sum()
        .sort_values(ascending=False)
        .reset_index()
    )
    cols = [out_col, "revenue"]
    rows = [tuple(row) for row in grouped.itertuples(index=False, name=None)]
    return cols, rows

def run_metric(metric_name: str, start_date: str, end_date: str):
    catalog = load_catalog()
    metric = get_metric(catalog, metric_name)

    engine = get_engine()
    sql = text(metric["sql_template"])
    params = {"start_date": start_date, "end_date": end_date}

    try:
        with engine.connect() as conn:
            result = conn.execute(sql, params)
            rows = result.fetchall()
            cols = list(result.keys())
    except SQLAlchemyError:
        return _run_metric_from_csv(metric_name, start_date, end_date)

    if not rows:
        return _run_metric_from_csv(metric_name, start_date, end_date)

    return cols, rows

if __name__ == "__main__":
    cols, rows = run_metric("revenue_daily", "2016-01-01", "2017-12-31")
    print(cols)
    print(rows[:10])
