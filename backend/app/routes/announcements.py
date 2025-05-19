from fastapi import APIRouter, Depends, HTTPException
from app.services.announcements import *
from app.schemas.announcements import *
from app.services.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=AnnouncementOut)
async def create_announcement(
    announcement: AnnouncementCreate,
    current_user: dict = Depends(get_current_user)
):
    return await create_announcement(announcement, current_user)

@router.get("/", response_model=list[AnnouncementOut])
async def list_announcements(
    skip: int = 0,
    limit: int = 100,
    is_important: bool = None,
    current_user: dict = Depends(get_current_user)
):
    return await get_announcements(skip, limit, is_important)

@router.get("/{announcement_id}", response_model=AnnouncementOut)
async def get_announcement(
    announcement_id: str,
    current_user: dict = Depends(get_current_user)
):
    announcement = await get_announcement_by_id(announcement_id)
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    return announcement

@router.put("/{announcement_id}", response_model=AnnouncementOut)
async def update_announcement(
    announcement_id: str,
    announcement: AnnouncementUpdate,
    current_user: dict = Depends(get_current_user)
):
    return await update_announcement(announcement_id, announcement, current_user)

@router.delete("/{announcement_id}")
async def delete_announcement(
    announcement_id: str,
    current_user: dict = Depends(get_current_user)
):
    await delete_announcement(announcement_id, current_user)
    return {"message": "Announcement deleted"}