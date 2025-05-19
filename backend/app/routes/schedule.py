from fastapi import APIRouter, Depends, HTTPException
from app.services.schedule import *
from app.schemas.schedule import *
from app.services.auth import get_current_user, has_admin_role

router = APIRouter()

@router.post("/", response_model=ScheduleOut)
async def create_schedule(
    schedule: ScheduleCreate,
    current_user: dict = Depends(get_current_user)
):
    if not has_admin_role(current_user):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return await create_schedule_item(schedule)

@router.get("/", response_model=list[ScheduleOut])
async def list_schedule(
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user)
):
    return await get_schedule_items(skip, limit)

@router.get("/{schedule_id}", response_model=ScheduleOut)
async def get_schedule(
    schedule_id: str,
    current_user: dict = Depends(get_current_user)
):
    schedule = await get_schedule_item(schedule_id)
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule item not found")
    return schedule

@router.put("/{schedule_id}", response_model=ScheduleOut)
async def update_schedule(
    schedule_id: str,
    schedule: ScheduleUpdate,
    current_user: dict = Depends(get_current_user)
):
    if not has_admin_role(current_user):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return await update_schedule_item(schedule_id, schedule)

@router.delete("/{schedule_id}")
async def delete_schedule(
    schedule_id: str,
    current_user: dict = Depends(get_current_user)
):
    if not has_admin_role(current_user):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    await delete_schedule_item(schedule_id)
    return {"message": "Schedule item deleted"}