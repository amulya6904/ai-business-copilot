from core.analytics.delta_explainer import explain_delta
from core.analytics.insight_writer import write_insight


def generate_insight(payload: dict) -> dict:
    delta = explain_delta(
        payload["metric"],
        payload["period_a_start"],
        payload["period_a_end"],
        payload["period_b_start"],
        payload["period_b_end"],
    )
    return write_insight(delta)
