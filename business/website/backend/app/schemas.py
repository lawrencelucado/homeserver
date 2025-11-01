from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class ContactFormSubmission(BaseModel):
    """Schema for contact form submission request."""

    name: str = Field(..., min_length=1, max_length=255, description="Contact name")
    email: EmailStr = Field(..., description="Contact email address")
    company: Optional[str] = Field(None, max_length=255, description="Company name")
    service: Optional[str] = Field(None, max_length=255, description="Service of interest")
    message: str = Field(..., min_length=1, description="Message content")


class ContactSubmissionResponse(BaseModel):
    """Schema for contact form submission response."""

    id: int
    name: str
    email: str
    company: Optional[str]
    service: Optional[str]
    message: str
    created_at: datetime

    class Config:
        from_attributes = True
