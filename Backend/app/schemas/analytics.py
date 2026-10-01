"""Analytics schemas (scaffold)."""

from pydantic import BaseModel


class AnalyticsBase(BaseModel):
    metric: str
