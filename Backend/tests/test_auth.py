import pytest
from fastapi import HTTPException
from starlette.requests import Request

from app.api import auth
from app.api import health


def test_health_router_uses_api_prefix():
    assert health.router.prefix == "/api/health"


def test_google_login_does_not_request_previously_granted_scopes(monkeypatch):
    authorization_options = {}
    generated_values = iter(
        ["state_one", "verifier_one", "state_two", "verifier_two"]
    )

    class FakeFlow:
        def authorization_url(self, **kwargs):
            authorization_options.update(kwargs)
            return "https://accounts.google.com/o/oauth2/auth", "state"

    monkeypatch.setattr(auth, "create_google_flow", lambda: FakeFlow())
    monkeypatch.setattr(
        auth.secrets,
        "token_urlsafe",
        lambda _: next(generated_values),
    )

    first_response = auth.google_login()
    second_response = auth.google_login()

    first_cookie_names = {
        header.split("=", 1)[0]
        for header in first_response.headers.getlist("set-cookie")
    }
    second_cookie_names = {
        header.split("=", 1)[0]
        for header in second_response.headers.getlist("set-cookie")
    }

    assert "include_granted_scopes" not in authorization_options
    assert first_cookie_names == {
        "oauth_state_state_one",
        "oauth_code_verifier_state_one",
    }
    assert second_cookie_names == {
        "oauth_state_state_two",
        "oauth_code_verifier_state_two",
    }


def test_google_callback_uses_matching_state_cookies(monkeypatch):
    exchanged_verifier = None

    class FakeFlow:
        code_verifier = None

        def fetch_token(self, **kwargs):
            nonlocal exchanged_verifier
            exchanged_verifier = self.code_verifier
            raise RuntimeError("stop after checking the verifier")

    monkeypatch.setattr(auth, "create_google_flow", lambda: FakeFlow())

    request = Request(
        {
            "type": "http",
            "http_version": "1.1",
            "method": "GET",
            "scheme": "http",
            "path": "/api/auth/google/callback",
            "raw_path": b"/api/auth/google/callback",
            "query_string": b"",
            "headers": [
                (
                    b"cookie",
                    b"oauth_state_state_one=state_one; "
                    b"oauth_code_verifier_state_one=verifier_one",
                )
            ],
            "server": ("localhost", 8000),
            "client": ("localhost", 12345),
        }
    )

    with pytest.raises(HTTPException) as exception:
        auth.google_callback(
            request=request,
            code="authorization-code",
            state="state_one",
            error=None,
            db=None,
        )

    assert exchanged_verifier == "verifier_one"
    assert exception.value.detail.startswith(
        "Failed to exchange Google authorization code:"
    )
