"""Settings ORM model (scaffold)."""

from dataclasses import dataclass


@dataclass
class SettingsModel:
    id: int = 0
    key: str = ""
    value: str = ""
