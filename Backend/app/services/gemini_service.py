import json
import re
from typing import Any, cast

import google.generativeai as genai

from app.core.config import settings


def get_gemini_model(system_instruction: str | None = None) -> Any:
    if not settings.GEMINI_API_KEY:
        raise ValueError(
            "GEMINI_API_KEY is not set in backend configuration (.env)."
        )

    genai_api: Any = cast(Any, genai)
    genai_api.configure(api_key=settings.GEMINI_API_KEY)

    # Use gemini-1.5-flash or gemini-2.0-flash / gemini-1.5-pro
    model_name = "gemini-3.8-flash"
    return genai_api.GenerativeModel(
        model_name=model_name,
        system_instruction=system_instruction if system_instruction else None,
    )


def ask_gemini(prompt: str, system_instruction: str | None = None) -> str:
    """
    Send a prompt to real Google Gemini AI.
    """
    model = get_gemini_model(system_instruction=system_instruction)
    response = model.generate_content(prompt)

    if response and response.text:
        return response.text.strip()

    return "No response received from Gemini AI."


def generate_draft_reply(
    sender_name: str,
    sender_email: str,
    subject: str,
    body: str,
    user_name: str,
) -> str:
    """
    Generate a real AI draft reply for an email thread.
    """
    prompt = f"""
Draft a professional, concise, and helpful email reply.

SENDER: {sender_name} <{sender_email}>
SUBJECT: {subject}
EMAIL BODY:
{body}

SENDER OF REPLY: {user_name}

INSTRUCTIONS:
1. Address the sender by first name.
2. Provide a polite and relevant response based on the email content.
3. Sign off with:
Best regards,
{user_name}
""".strip()

    return ask_gemini(prompt)


def analyze_email_with_ai(subject: str, body: str) -> dict[str, Any]:
    """
    Analyze a real email using Google Gemini AI.
    """

    prompt = f"""
Analyze the following email and return ONLY a valid JSON object.

Subject:
{subject}

Body:
{body}

Return exactly this structure:

{{
  "category": "Career" | "System" | "Design" | "Newsletters" | "Inbox",
  "priority": "urgent" | "high" | "medium" | "low",
  "key_takeaways": [
    "important point 1",
    "important point 2"
  ],
  "recommended_action": "What the user should do next",
  "sentiment": "positive" | "neutral" | "urgent" | "action_required"
}}
""".strip()

    raw_text = ask_gemini(prompt)

    match = re.search(
        r"\{.*\}",
        raw_text,
        re.DOTALL,
    )

    if not match:
        raise ValueError(
            "Gemini returned an invalid analysis response."
        )

    try:
        analysis: dict[str, Any] = json.loads(
            match.group(0)
        )
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Gemini returned invalid JSON: {exc}"
        ) from exc

    return analysis