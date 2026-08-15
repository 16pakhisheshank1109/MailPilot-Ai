"""Email schemas (scaffold)."""

from pydantic import BaseModel


class EmailBase(BaseModel):
    subject: str
    body: str | None = None
