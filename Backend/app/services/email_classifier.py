import html
import re
from typing import TypedDict


class EmailMetadata(TypedDict):
    category: str
    priority: str
    has_tasks: bool


def _contains_any(text: str, phrases: tuple[str, ...]) -> bool:
    return any(
        re.search(rf"(?<!\w){re.escape(phrase)}(?!\w)", text)
        for phrase in phrases
    )


def classify_email_metadata(
    *,
    sender_name: str,
    sender_email: str,
    subject: str,
    snippet: str,
    body: str,
) -> EmailMetadata:
    searchable_body = html.unescape(re.sub(r"<[^>]+>", " ", body)).lower()
    header_text = " ".join(
        (sender_name, sender_email, subject, snippet)
    ).lower()
    full_text = f"{header_text} {searchable_body}"

    if _contains_any(
        header_text,
        (
            "career", "job opening", "job alert", "hiring", "internship",
            "placement", "recruitment", "interview", "job opportunity",
        ),
    ):
        category = "Career"
    elif _contains_any(
        header_text,
        ("design", "figma", "ui/ux", "ux", "behance", "dribbble"),
    ):
        category = "Design"
    elif _contains_any(
        header_text,
        (
            "security alert", "verification", "verify your", "password",
            "sign in", "sign-in", "account alert", "receipt", "invoice",
        ),
    ):
        category = "System"
    elif _contains_any(
        header_text,
        ("newsletter", "digest", "weekly roundup", "daily roundup"),
    ) or "unsubscribe" in searchable_body:
        category = "Newsletters"
    else:
        category = "Inbox"

    if _contains_any(
        full_text,
        ("urgent", "asap", "immediately", "action required"),
    ):
        priority = "urgent"
    elif _contains_any(
        full_text,
        ("deadline", "due by", "respond by", "submit by", "response required"),
    ):
        priority = "high"
    elif category == "Newsletters":
        priority = "low"
    else:
        priority = "medium"

    has_tasks = _contains_any(
        full_text,
        (
            "action required", "please submit", "please complete",
            "please review", "please respond", "please register",
            "please apply", "response required", "submit by", "due by",
            "deadline", "follow up", "follow-up", "to-do", "todo",
        ),
    )

    return {
        "category": category,
        "priority": priority,
        "has_tasks": has_tasks,
    }