from typing import List

from pydantic import BaseModel, Field


class InsightRequest(BaseModel):
    metric: str = Field(..., examples=["revenue"])
    period_a_start: str = Field(..., examples=["2017-01-01"])
    period_a_end: str = Field(..., examples=["2017-01-31"])
    period_b_start: str = Field(..., examples=["2016-01-01"])
    period_b_end: str = Field(..., examples=["2016-01-31"])


class InsightResponse(BaseModel):
    title: str
    summary: str
    key_drivers: List[str]
    actions: List[str]
    risks: List[str]
