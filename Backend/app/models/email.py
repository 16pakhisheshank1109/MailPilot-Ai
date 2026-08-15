"""Email ORM model (scaffold)."""

from dataclasses import dataclass


@dataclass
class Email:
    id: int = 0
    subject: str = ""
