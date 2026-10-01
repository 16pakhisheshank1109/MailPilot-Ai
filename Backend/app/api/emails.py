import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session, load_only

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.email import Email
from app.models.user import User
from app.schemas.email import EmailCreate, EmailResponse
from app.services.gmail_service import fetch_recent_emails
from app.services.email_classifier import classify_email_metadata
from app.services.gemini_service import (
    generate_draft_reply,
    analyze_email_with_ai,
)


router = APIRouter(
    prefix="/api/emails",
    tags=["Emails"],
)


@router.get(
    "/",
    response_model=list[EmailResponse],
)
def get_emails(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Email]:
    """
    Get emails belonging to the currently authenticated user.
    """
    return (
        db.query(Email)
        .filter(Email.user_id == user.id)
        .order_by(Email.received_at.desc())
        .all()
    )


@router.get("/notifications")
def get_email_notifications(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    unread_emails = db.query(Email).filter(
        Email.user_id == user.id,
        Email.is_read.is_(False),
        Email.is_archived.is_(False),
    )
    unread_count = unread_emails.with_entities(
        func.count(Email.id)
    ).scalar() or 0
    recent_unread = (
        unread_emails.order_by(Email.received_at.desc())
        .limit(8)
        .all()
    )

    return {
        "unread_count": unread_count,
        "notifications": [
            {
                "id": email.id,
                "sender_name": email.sender_name,
                "subject": email.subject,
                "snippet": email.snippet or "",
                "received_at": email.received_at,
                "priority": email.priority,
            }
            for email in recent_unread
        ],
    }


@router.get(
    "/{email_id}",
    response_model=EmailResponse,
)
def get_email(
    email_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Email:
    """
    Get one email belonging to the authenticated user.
    """
    email = (
        db.query(Email)
        .filter(
            Email.id == email_id,
            Email.user_id == user.id,
        )
        .first()
    )

    if not email:
        raise HTTPException(
            status_code=404,
            detail="Email not found",
        )

    return email


@router.post(
    "/",
    response_model=EmailResponse,
)
def create_email(
    data: EmailCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Email:
    """
    Create an email record scoped to the authenticated user.
    """
    email = Email(
        id=str(uuid.uuid4()),
        user_id=user.id,
        sender_name=data.sender_name,
        sender_email=data.sender_email,
        recipient=data.recipient,
        subject=data.subject,
        body=data.body,
        snippet=data.snippet,
        category=data.category,
        priority=data.priority,
        is_read=data.is_read,
        is_starred=data.is_starred,
        is_archived=data.is_archived,
        has_tasks=data.has_tasks,
    )

    db.add(email)
    db.commit()
    db.refresh(email)

    return email


@router.post("/sync")
def sync_gmail(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict[str, str | int]:
    """
    Fetch recent REAL Gmail messages and save/sync them
    into the authenticated user's MailPilot inbox.
    """
    if not user.google_refresh_token:
        raise HTTPException(
            status_code=400,
            detail="Google Gmail authorization is not available for this user",
        )

    known_message_ids = {
        row[0]
        for row in db.query(Email.id)
        .filter(Email.user_id == user.id)
        .all()
    }
    emails_needing_classification = (
        db.query(Email)
        .filter(
            Email.user_id == user.id,
            Email.category == "Inbox",
            Email.priority == "medium",
            Email.has_tasks.is_(False),
        )
        .options(
            load_only(
                Email.id,
                Email.sender_name,
                Email.sender_email,
                Email.subject,
                Email.snippet,
            )
        )
        .order_by(Email.received_at.desc())
        .limit(80)
        .all()
    )

    try:
        gmail_emails = fetch_recent_emails(
            refresh_token=user.google_refresh_token,
            max_results=80,
            known_message_ids=known_message_ids,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to fetch Gmail messages: {exc}",
        )

    print("\n========== GMAIL SYNC ==========")
    print(f"Fetched from Gmail: {len(gmail_emails)}")

    for gmail_email in gmail_emails[:10]:
        print(
           f"{gmail_email['received_at']} | "
           f"{gmail_email['sender_name']} | "
           f"{gmail_email['subject']}"
    )

    print("================================\n")

    inserted = 0
    updated = 0

    fetched_ids = {gmail_email["id"] for gmail_email in gmail_emails}
    existing_by_id = {
        email.id: email
        for email in db.query(Email)
        .filter(
            Email.user_id == user.id,
            Email.id.in_(fetched_ids),
        )
        .all()
    } if fetched_ids else {}

    seen_ids: set[str] = set()

    for gmail_email in gmail_emails:
        message_id = gmail_email["id"]
        if message_id in seen_ids:
            continue
        seen_ids.add(message_id)

        existing = existing_by_id.get(message_id)

        if existing:
            existing.sender_name = gmail_email["sender_name"]
            existing.sender_email = gmail_email["sender_email"]
            existing.recipient = gmail_email["recipient"]
            existing.subject = gmail_email["subject"]
            existing.body = gmail_email["body"]
            existing.snippet = gmail_email["snippet"]
            existing.is_read = gmail_email["is_read"]
            existing.is_starred = gmail_email["is_starred"]
            existing.is_archived = gmail_email["is_archived"]
            existing.received_at = gmail_email["received_at"]
            updated += 1
        else:
            metadata = classify_email_metadata(
                sender_name=gmail_email["sender_name"],
                sender_email=gmail_email["sender_email"],
                subject=gmail_email["subject"],
                snippet=gmail_email["snippet"],
                body=gmail_email["body"],
            )
            email = Email(
                id=message_id,
                user_id=user.id,
                sender_name=gmail_email["sender_name"],
                sender_email=gmail_email["sender_email"],
                recipient=gmail_email["recipient"],
                subject=gmail_email["subject"],
                body=gmail_email["body"],
                snippet=gmail_email["snippet"],
                category=metadata["category"],
                priority=metadata["priority"],
                is_read=gmail_email["is_read"],
                is_starred=gmail_email["is_starred"],
                is_archived=gmail_email["is_archived"],
                has_tasks=metadata["has_tasks"],
                received_at=gmail_email["received_at"],
            )
            db.add(email)
            inserted += 1

    for email in emails_needing_classification:
        metadata = classify_email_metadata(
            sender_name=email.sender_name,
            sender_email=email.sender_email,
            subject=email.subject,
            snippet=email.snippet or "",
            body="",
        )
        email.category = metadata["category"]
        email.priority = metadata["priority"]
        email.has_tasks = metadata["has_tasks"]

    db.commit()

    return {
        "message": "Gmail sync completed successfully",
        "fetched": len(gmail_emails),
        "inserted": inserted,
        "updated": updated,
    }

@router.post("/{email_id}/analyze")
def analyze_email(
    email_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    """
    Analyze a real email using Gemini AI.
    """

    email = (
        db.query(Email)
        .filter(
            Email.id == email_id,
            Email.user_id == user.id,
        )
        .first()
    )

    if not email:
        raise HTTPException(
            status_code=404,
            detail="Email not found",
        )

    try:
        analysis = analyze_email_with_ai(
            subject=email.subject,
            body=email.body,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Gemini AI analysis failed: {exc}",
        )

    return {
        "email_id": email_id,
        "subject": email.subject,
        "analysis": analysis,
    }


@router.post("/{email_id}/draft-reply")
def create_draft_reply(
    email_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    """
    Generate an AI draft reply using Gemini AI for an email thread.
    """
    email = (
        db.query(Email)
        .filter(
            Email.id == email_id,
            Email.user_id == user.id,
        )
        .first()
    )

    if not email:
        raise HTTPException(
            status_code=404,
            detail="Email not found",
        )

    try:
        reply_text = generate_draft_reply(
            sender_name=email.sender_name,
            sender_email=email.sender_email,
            subject=email.subject,
            body=email.body,
            user_name=user.name,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Gemini AI error: {exc}",
        )

    return {
        "email_id": email_id,
        "draft_reply": reply_text,
    }


@router.patch("/{email_id}/read")
def mark_email_read(
    email_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    email = (
        db.query(Email)
        .filter(
            Email.id == email_id,
            Email.user_id == user.id,
        )
        .first()
    )

    if not email:
        raise HTTPException(
            status_code=404,
            detail="Email not found",
        )

    email.is_read = True
    db.commit()

    return {
        "message": "Email marked as read",
        "id": email_id,
    }


@router.patch("/{email_id}/star")
def toggle_star(
    email_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict[str, str | bool]:
    email = (
        db.query(Email)
        .filter(
            Email.id == email_id,
            Email.user_id == user.id,
        )
        .first()
    )

    if not email:
        raise HTTPException(
            status_code=404,
            detail="Email not found",
        )

    email.is_starred = not email.is_starred
    db.commit()

    return {
        "message": "Star status updated",
        "is_starred": email.is_starred,
    }


@router.delete("/{email_id}")
def delete_email(
    email_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    email = (
        db.query(Email)
        .filter(
            Email.id == email_id,
            Email.user_id == user.id,
        )
        .first()
    )

    if not email:
        raise HTTPException(
            status_code=404,
            detail="Email not found",
        )

    db.delete(email)
    db.commit()

    return {
        "message": "Email deleted",
    }


@router.patch("/{email_id}/archive")
def archive_email(
    email_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    email = (
        db.query(Email)
        .filter(
            Email.id == email_id,
            Email.user_id == user.id,
        )
        .first()
    )

    if not email:
        raise HTTPException(
            status_code=404,
            detail="Email not found",
        )

    email.is_archived = True
    db.commit()

    return {
        "message": "Email archived",
        "id": email_id,
    }