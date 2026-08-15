"""Analytics ORM model (scaffold)."""

from dataclasses import dataclass


@dataclass
class Analytics:
    id: int = 0
    metric: str = ""
