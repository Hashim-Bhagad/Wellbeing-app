from fastapi import APIRouter, Depends
from app.core.database import get_database
from app.routes.auth import get_current_user
from app.models.user import UserResponse
from datetime import datetime

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
async def get_user_profile(
    current_user: dict = Depends(get_current_user)
):
    # current_user already has the data, just return it
    # _id is already converted to str in get_current_user if needed for simple dict access, 
    # but for Pydantic response (UserResponse), it expects the dict to have _id field.
    return current_user

@router.get("/reminders/status")
async def get_reminder_status(
    current_user: dict = Depends(get_current_user)
):
    next_date = current_user.get("next_checkup_date")
    days_remaining = None
    if next_date:
        delta = next_date - datetime.utcnow()
        days_remaining = delta.days
        
    return {
        "next_checkup_date": next_date,
        "days_remaining": days_remaining,
        "reminder_enabled": True # Default to true for MVP
    }
