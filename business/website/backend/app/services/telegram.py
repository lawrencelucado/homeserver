import httpx
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class TelegramService:
    """Service for sending Telegram notifications."""

    def __init__(self):
        self.bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
        self.chat_id = os.getenv("TELEGRAM_CHAT_ID")
        self.base_url = f"https://api.telegram.org/bot{self.bot_token}"

    async def send_contact_notification(
        self, name: str, email: str, company: Optional[str], service: Optional[str], message: str
    ):
        """Send Telegram notification for new contact form submission."""
        if not all([self.bot_token, self.chat_id]):
            logger.warning("Telegram credentials not configured, skipping Telegram notification")
            return

        text = f"""
🔔 *New Contact Form Submission*

👤 *Name:* {name}
📧 *Email:* {email}
🏢 *Company:* {company or 'N/A'}
🛠️ *Service Interest:* {service or 'N/A'}

💬 *Message:*
{message}

---
_DataLux Consulting Website_
"""

        payload = {
            "chat_id": self.chat_id,
            "text": text,
            "parse_mode": "Markdown",
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/sendMessage",
                    json=payload,
                    timeout=10.0,
                )
                response.raise_for_status()
                logger.info(f"Telegram notification sent to chat_id {self.chat_id}")
        except Exception as e:
            logger.error(f"Failed to send Telegram notification: {e}")
            raise
