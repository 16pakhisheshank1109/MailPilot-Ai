from __future__ import annotations

import base64
import time
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from typing import Any, cast

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from app.core.config import settings


GMAIL_SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
]
GMAIL_BATCH_SIZE = 10
MAX_GMAIL_BATCH_ATTEMPTS = 3
GMAIL_RETRY_BASE_SECONDS = 15


def _is_gmail_rate_limit_error(error: Exception) -> bool:
    response = getattr(error, "resp", None)
    status_code = getattr(response, "status", None)

    if status_code == 429:
        return True

    return status_code == 403 and any(
        reason in str(error)
        for reason in (
            "rateLimitExceeded",
            "userRateLimitExceeded",
        )
    )


def create_gmail_credentials(refresh_token: str) -> Credentials:
    """
    Rebuild Google credentials from the user's stored refresh token.
    """

    credentials = Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        scopes=GMAIL_SCOPES,
    )

    # Obtain a fresh access token from Google's OAuth server.
    cast(Any, credentials).refresh(Request())

    return credentials


def create_gmail_service(refresh_token: str) -> Any:
    """
    Create an authenticated Gmail API client.
    """

    credentials = create_gmail_credentials(refresh_token)

    return build(
        "gmail",
        "v1",
        credentials=credentials,
        cache_discovery=False,
    )


def get_header(headers: list[dict[str, str]], name: str) -> str:
    """
    Find a Gmail header such as From, To or Subject.
    """

    for header in headers:
        if header.get("name", "").lower() == name.lower():
            return header.get("value", "")

    return ""


def decode_body(data: str | None) -> str:
    """
    Decode Gmail's URL-safe base64 message body.
    """

    if not data:
        return ""

    try:
        decoded = base64.urlsafe_b64decode(
            data + "=" * (-len(data) % 4)
        )

        return decoded.decode(
            "utf-8",
            errors="replace",
        )

    except Exception:
        return ""


def extract_text_from_payload(payload: dict[str, Any]) -> str:
    """
    Recursively extract readable text from Gmail MIME parts.
    """

    mime_type = payload.get("mimeType", "")

    body = payload.get("body", {})
    data = body.get("data")

    if data and mime_type == "text/plain":
        return decode_body(data)

    parts = payload.get("parts", [])

    text_parts: list[str] = []

    for part in parts:
        text = extract_text_from_payload(part)

        if text:
            text_parts.append(text)

    if text_parts:
        return "\n\n".join(text_parts)

    # Fallback for HTML-only messages.
    if data and mime_type == "text/html":
        return decode_body(data)

    return ""


def parse_received_date(
    headers: list[dict[str, str]],
    internal_date: str | None,
) -> datetime:
    """
    Convert Gmail's date information into a timezone-aware datetime.
    """

    date_header = get_header(headers, "Date")

    if date_header:
        try:
            parsed = parsedate_to_datetime(date_header)

            if parsed.tzinfo is None:
                parsed = parsed.replace(tzinfo=timezone.utc)

            return parsed.astimezone(timezone.utc)

        except Exception:
            pass

    if internal_date:
        try:
            timestamp = int(internal_date) / 1000

            return datetime.fromtimestamp(
                timestamp,
                tz=timezone.utc,
            )

        except Exception:
            pass

    return datetime.now(timezone.utc)


def list_messages(
    refresh_token: str,
    max_results: int = 20,
) -> list[dict[str, Any]]:
    """
    Get recent Gmail messages for the authenticated user.
    """

    service = create_gmail_service(refresh_token)

    response = (
        service.users()
        .messages()
        .list(
            userId="me",
            labelIds=["INBOX"],
            maxResults=max_results,
        )
        .execute()
    )

    return response.get("messages", [])


def get_message(
    refresh_token: str,
    message_id: str,
) -> dict[str, Any]:
    """
    Retrieve the full Gmail message.
    """

    service = create_gmail_service(refresh_token)

    return (
        service.users()
        .messages()
        .get(
            userId="me",
            id=message_id,
            format="full",
        )
        .execute()
    )


def parse_gmail_message(
    message: dict[str, Any],
) -> dict[str, Any]:
    """
    Convert Gmail's API response into MailPilot's email structure.
    """

    payload = message.get("payload", {})

    headers = payload.get("headers", [])

    sender = get_header(headers, "From")
    recipient = get_header(headers, "To")
    subject = get_header(headers, "Subject")

    body = extract_text_from_payload(payload)

    snippet = message.get("snippet", "")

    received_at = parse_received_date(
        headers,
        message.get("internalDate"),
    )

    # Parse "Name <email@example.com>" format.
    sender_name = sender
    sender_email = sender

    if "<" in sender and ">" in sender:
        sender_name = sender.split("<", 1)[0].strip().strip('"')
        sender_email = (
            sender.split("<", 1)[1]
            .split(">", 1)[0]
            .strip()
        )

    label_ids = message.get("labelIds", [])

    is_read = "UNREAD" not in label_ids
    is_starred = "STARRED" in label_ids
    is_archived = "INBOX" not in label_ids

    return {
        "id": message["id"],
        "sender_name": sender_name or sender_email,
        "sender_email": sender_email,
        "recipient": recipient,
        "subject": subject or "(No Subject)",
        "body": body or snippet,
        "snippet": snippet,
        "is_read": is_read,
        "is_starred": is_starred,
        "is_archived": is_archived,
        "received_at": received_at,
    }


def fetch_recent_emails(
    refresh_token: str,
    max_results: int = 20,
    known_message_ids: set[str] | None = None,
) -> list[dict[str, Any]]:
    """
    Fetch and parse recent real Gmail messages.
    """

    service = create_gmail_service(refresh_token)
    response = (
        service.users()
        .messages()
        .list(
            userId="me",
            labelIds=["INBOX"],
            maxResults=max_results,
        )
        .execute()
    )
    message_refs = response.get("messages", [])

    messages_by_id: dict[str, dict[str, Any]] = {}
    batch_errors: dict[str, Exception] = {}

    def collect_message(
        request_id: str,
        message: dict[str, Any] | None,
        exception: Exception | None,
    ) -> None:
        if exception is not None:
            batch_errors[request_id] = exception
        elif message is not None:
            messages_by_id[request_id] = message
            batch_errors.pop(request_id, None)

    requested_ids: list[str] = []
    seen_message_ids: set[str] = set()

    for message_ref in message_refs:
        message_id = message_ref.get("id")

        if (
            not message_id
            or message_id in seen_message_ids
            or message_id in (known_message_ids or set())
        ):
            continue

        seen_message_ids.add(message_id)
        requested_ids.append(message_id)

    if requested_ids:
        for start in range(0, len(requested_ids), GMAIL_BATCH_SIZE):
            pending_ids = requested_ids[
                start : start + GMAIL_BATCH_SIZE
            ]

            for attempt in range(MAX_GMAIL_BATCH_ATTEMPTS):
                batch = service.new_batch_http_request()

                for message_id in pending_ids:
                    request = (
                        service.users()
                        .messages()
                        .get(
                            userId="me",
                            id=message_id,
                            format="full",
                        )
                    )
                    batch.add(
                        request,
                        request_id=message_id,
                        callback=collect_message,
                    )

                try:
                    batch.execute()
                except Exception as exc:
                    if (
                        not _is_gmail_rate_limit_error(exc)
                        or attempt == MAX_GMAIL_BATCH_ATTEMPTS - 1
                    ):
                        raise
                    time.sleep(
                        GMAIL_RETRY_BASE_SECONDS * 2**attempt
                    )
                    continue

                failed_ids = [
                    message_id
                    for message_id in pending_ids
                    if message_id in batch_errors
                ]
                if not failed_ids:
                    break

                non_rate_limit_error = next(
                    (
                        batch_errors[message_id]
                        for message_id in failed_ids
                        if not _is_gmail_rate_limit_error(
                            batch_errors[message_id]
                        )
                    ),
                    None,
                )
                if non_rate_limit_error is not None:
                    raise non_rate_limit_error
                if attempt == MAX_GMAIL_BATCH_ATTEMPTS - 1:
                    raise batch_errors[failed_ids[0]]

                pending_ids = failed_ids
                time.sleep(
                    GMAIL_RETRY_BASE_SECONDS * 2**attempt
                )

    return [
        parse_gmail_message(messages_by_id[message_id])
        for message_id in requested_ids
        if message_id in messages_by_id
    ]