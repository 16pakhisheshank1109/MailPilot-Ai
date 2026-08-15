"""Settings schemas (scaffold)."""

from pydantic import BaseModel


class SettingBase(BaseModel):
    key: str
    value: str
