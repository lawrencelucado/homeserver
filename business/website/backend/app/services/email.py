import aiosmtplib
from email.message import EmailMessage
import os
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending email notifications."""

    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = os.getenv("SMTP_USER")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.notification_email = os.getenv("NOTIFICATION_EMAIL")

    async def send_contact_notification(
        self, name: str, email: str, company: str, service: str, message: str
    ):
        """Send email notification for new contact form submission."""
        if not all([self.smtp_user, self.smtp_password, self.notification_email]):
            logger.warning("Email credentials not configured, skipping email notification")
            return

        email_message = EmailMessage()
        email_message["From"] = self.smtp_user
        email_message["To"] = self.notification_email
        email_message["Subject"] = f"New Contact Form Submission from {name}"

        body = f"""
New contact form submission received:

Name: {name}
Email: {email}
Company: {company or 'N/A'}
Service Interest: {service or 'N/A'}

Message:
{message}

---
This notification was sent automatically from DataLux Consulting website.
"""
        email_message.set_content(body)

        try:
            await aiosmtplib.send(
                email_message,
                hostname=self.smtp_host,
                port=self.smtp_port,
                username=self.smtp_user,
                password=self.smtp_password,
                start_tls=True,
            )
            logger.info(f"Email notification sent to {self.notification_email}")
        except Exception as e:
            logger.error(f"Failed to send email notification: {e}")
            raise
