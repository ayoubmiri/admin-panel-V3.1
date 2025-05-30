# app/api/api_v1/endpoints/dashboard.py

from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.database.models import User

router = APIRouter()

@router.get("/stats")
async def get_stats(current_user: User = Depends(get_current_user)):
    # Example response — replace with your logic
    return {"total_students": 100, "total_courses": 20}

@router.get("/enrollment")
async def get_enrollment(current_user: User = Depends(get_current_user)):
    # Your logic here
    return {"enrolled_students": 75}

@router.get("/attendance")
async def get_attendance(current_user: User = Depends(get_current_user)):
    # Your logic here
    return {"attendance_rate": 95}

@router.get("/recent-students")
async def get_recent_students(current_user: User = Depends(get_current_user)):
    # Your logic here
    return [{"id": "uuid1", "name": "John Doe"}, {"id": "uuid2", "name": "Jane Smith"}]

@router.get("/upcoming-events")
async def get_upcoming_events(current_user: User = Depends(get_current_user)):
    # Your logic here
    return [{"event": "Math Exam", "date": "2025-06-10"}]

@router.get("/recent-announcements")
async def get_recent_announcements(current_user: User = Depends(get_current_user)):
    # Your logic here
    return [{"title": "Holiday Notice", "content": "School closed on 2025-06-01"}]
