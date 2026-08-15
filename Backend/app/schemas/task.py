"""Task schemas (scaffold)."""

from pydantic import BaseModel


class TaskBase(BaseModel):
    title: str
