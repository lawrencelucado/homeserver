from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import logging

from ...database import get_db
from ...models import ContactSubmission
from ...schemas import ContactFormSubmission, ContactSubmissionResponse
from ...services.email import EmailService
from ...services.telegram import TelegramService

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/contact", response_model=ContactSubmissionResponse, status_code=201)
async def submit_contact_form(
    request: Request,
    form_data: ContactFormSubmission,
    db: Session = Depends(get_db),
):
    """
    Handle contact form submissions.

    - Saves submission to database
    - Sends email notification
    - Sends Telegram notification
    """
    try:
        # Get client IP and user agent
        client_ip = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")

        # Create database record
        submission = ContactSubmission(
            name=form_data.name,
            email=form_data.email,
            company=form_data.company,
            service=form_data.service,
            message=form_data.message,
            ip_address=client_ip,
            user_agent=user_agent,
        )
        db.add(submission)
        db.commit()
        db.refresh(submission)

        logger.info(f"Contact form submission saved: ID={submission.id}, name={submission.name}")

        # Send notifications (non-blocking, best effort)
        try:
            email_service = EmailService()
            await email_service.send_contact_notification(
                name=form_data.name,
                email=form_data.email,
                company=form_data.company or "",
                service=form_data.service or "",
                message=form_data.message,
            )
        except Exception as e:
            logger.error(f"Email notification failed: {e}")

        try:
            telegram_service = TelegramService()
            await telegram_service.send_contact_notification(
                name=form_data.name,
                email=form_data.email,
                company=form_data.company,
                service=form_data.service,
                message=form_data.message,
            )
        except Exception as e:
            logger.error(f"Telegram notification failed: {e}")

        return submission

    except Exception as e:
        logger.error(f"Error processing contact form: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to process contact form submission")
