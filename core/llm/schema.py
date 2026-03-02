from typing import Any, Dict


REQUIRED_KEYS = ["title", "summary", "key_drivers", "actions", "risks"]


def _ensure_min(lst, n, fallback_items):
    lst = [x.strip() for x in lst if isinstance(x, str) and x.strip()]
    if len(lst) >= n:
        return lst

    for item in fallback_items:
        if len(lst) >= n:
            break
        if item not in lst:
            lst.append(item)
    return lst


def validate_insight(obj: Dict[str, Any]) -> Dict[str, Any]:
    for k in REQUIRED_KEYS:
        if k not in obj:
            raise ValueError(f"Missing key: {k}")

    if not isinstance(obj["title"], str):
        raise ValueError("title must be str")
    if not isinstance(obj["summary"], str):
        raise ValueError("summary must be str")
    for k in ["key_drivers", "actions", "risks"]:
        if not isinstance(obj[k], list):
            raise ValueError(f"{k} must be list[str]")

    obj["title"] = obj["title"].strip()
    obj["summary"] = obj["summary"].strip()

    obj["key_drivers"] = _ensure_min(
        obj["key_drivers"],
        3,
        [
            "Key driver details were limited; validate category and region contribution splits.",
            "Confirm whether growth is volume-driven or price- or discount-driven.",
            "Check if a small set of customers or orders is disproportionately driving the change.",
        ],
    )
    obj["actions"] = _ensure_min(
        obj["actions"],
        3,
        [
            "Investigate top contributing segments and replicate winning tactics across similar segments.",
            "Review pricing and discount policy for the top drivers and ensure profitability is protected.",
            "Monitor the trend weekly and set alerts for reversals or margin erosion.",
        ],
    )
    obj["risks"] = _ensure_min(
        obj["risks"],
        2,
        [
            "The increase may be driven by discounts, causing margin deterioration.",
            "Results may be skewed by seasonality or a one-off large order or customer.",
        ],
    )
    return obj
