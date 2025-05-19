from fastapi import APIRouter, Depends, HTTPException
from app.services.teachers import *
from app.schemas.teachers import *
from app.services.auth import get_current_user, has_admin_role

router = APIRouter()

@router.post("/", response_model=TeacherOut)
async def create_teacher(
    teacher: TeacherCreate,
    current_user: dict = Depends(get_current_user)
):
    if not has_admin_role(current_user):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return await create_teacher(teacher)

@router.get("/", response_model=list[TeacherOut])
async def list_teachers(
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user)
):
    return await get_teachers(skip, limit)

@router.get("/{teacher_id}", response_model=TeacherOut)
async def get_teacher(
    teacher_id: str,
    current_user: dict = Depends(get_current_user)
):
    teacher = await get_teacher_by_id(teacher_id)
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher

@router.put("/{teacher_id}", response_model=TeacherOut)
async def update_teacher(
    teacher_id: str,
    teacher: TeacherUpdate,
    current_user: dict = Depends(get_current_user)
):
    if not has_admin_role(current_user):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return await update_teacher(teacher_id, teacher)

@router.delete("/{teacher_id}")
async def delete_teacher(
    teacher_id: str,
    current_user: dict = Depends(get_current_user)
):
    if not has_admin_role(current_user):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    await delete_teacher(teacher_id)
    return {"message": "Teacher deleted"}