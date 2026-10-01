from fastapi import APIRouter

router = APIRouter(
    prefix="/api/health",
    tags=["Health"],
)


@router.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "MailPilot AI",
        "version": "1.0.0",
    }