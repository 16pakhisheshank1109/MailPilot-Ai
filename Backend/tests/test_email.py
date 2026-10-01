from types import SimpleNamespace

from app.services import gmail_service
from app.services.email_classifier import classify_email_metadata


def test_classify_email_metadata_for_tabs():
    metadata = classify_email_metadata(
        sender_name="Campus Careers",
        sender_email="jobs@example.com",
        subject="Action required: submit your internship application",
        snippet="Please submit by Friday.",
        body="Please complete the application form.",
    )

    assert metadata == {
        "category": "Career",
        "priority": "urgent",
        "has_tasks": True,
    }


def test_classify_email_metadata_recognizes_newsletters():
    metadata = classify_email_metadata(
        sender_name="Daily Digest",
        sender_email="digest@example.com",
        subject="Your weekly newsletter",
        snippet="A roundup of this week's updates.",
        body="Read online or unsubscribe.",
    )

    assert metadata["category"] == "Newsletters"
    assert metadata["priority"] == "low"
    assert metadata["has_tasks"] is False


def test_fetch_recent_emails_uses_small_batches_and_retries_rate_limits(
    monkeypatch,
):
    message_ids = [f"message-{index}" for index in range(12)]
    service_creations = []
    batch_executions = []
    rate_limited_ids = set()
    retry_delays = []

    class RateLimitError(Exception):
        resp = SimpleNamespace(status=403)

        def __str__(self):
            return "rateLimitExceeded"

    class ListRequest:
        def execute(self):
            return {"messages": [{"id": item} for item in message_ids]}

    class GetRequest:
        def __init__(self, message_id):
            self.message_id = message_id

    class Messages:
        def list(self, **kwargs):
            return ListRequest()

        def get(self, **kwargs):
            return GetRequest(kwargs["id"])

    class Users:
        def messages(self):
            return Messages()

    class Batch:
        def __init__(self):
            self.requests = []

        def add(self, request, request_id, callback):
            self.requests.append((request, request_id, callback))

        def execute(self):
            batch_executions.append(len(self.requests))
            for request, request_id, callback in self.requests:
                if (
                    request_id == "message-0"
                    and request_id not in rate_limited_ids
                ):
                    rate_limited_ids.add(request_id)
                    callback(request_id, None, RateLimitError())
                    continue

                callback(
                    request_id,
                    {
                        "id": request.message_id,
                        "payload": {"headers": []},
                        "snippet": request.message_id,
                    },
                    None,
                )

    class Service:
        def users(self):
            return Users()

        def new_batch_http_request(self):
            return Batch()

    def create_service(refresh_token):
        service_creations.append(refresh_token)
        return Service()

    monkeypatch.setattr(
        gmail_service,
        "create_gmail_service",
        create_service,
    )
    monkeypatch.setattr(
        gmail_service.time,
        "sleep",
        retry_delays.append,
    )

    emails = gmail_service.fetch_recent_emails(
        refresh_token="refresh-token",
        max_results=2,
        known_message_ids={"message-1", "message-2"},
    )

    assert service_creations == ["refresh-token"]
    assert batch_executions == [10, 1]
    assert retry_delays == [15]
    assert [email["id"] for email in emails] == [
        "message-0",
        *[f"message-{index}" for index in range(3, 12)],
    ]


def test_fetch_recent_emails_deduplicates_message_ids(monkeypatch):
    list_request = SimpleNamespace(
        execute=lambda: {"messages": [{"id": "dup"}, {"id": "dup"}, {"id": "new"}]}
    )

    class Messages:
        def list(self, **kwargs):
            return list_request

        def get(self, **kwargs):
            return SimpleNamespace(
                message_id=kwargs["id"],
            )

    class Users:
        def messages(self):
            return Messages()

    class Batch:
        def add(self, request, request_id, callback):
            callback(
                request_id,
                {"id": request.message_id, "payload": {"headers": []}, "snippet": request.message_id},
                None,
            )

        def execute(self):
            return None

    class Service:
        def users(self):
            return Users()

        def new_batch_http_request(self):
            return Batch()

    monkeypatch.setattr(
        gmail_service,
        "create_gmail_service",
        lambda refresh_token: Service(),
    )

    emails = gmail_service.fetch_recent_emails(
        refresh_token="refresh-token",
        max_results=10,
        known_message_ids=set(),
    )

    assert [email["id"] for email in emails] == ["dup", "new"]
