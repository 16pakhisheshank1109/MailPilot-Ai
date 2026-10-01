from typing import Any, cast

from google_auth_oauthlib.flow import Flow
from app.core.config import settings


GOOGLE_SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/gmail.readonly",
]


def create_google_flow() -> Flow:
    flow_factory: Any = cast(Any, Flow)
    flow = flow_factory.from_client_config(
        {
            "web": {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [
                    settings.GOOGLE_REDIRECT_URI
                ],
            }
        },
        scopes=GOOGLE_SCOPES,
    )

    flow.redirect_uri = settings.GOOGLE_REDIRECT_URI

    return flow