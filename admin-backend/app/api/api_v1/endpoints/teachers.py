from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.teachers import TeacherInDB, TeacherCreate, TeacherUpdate
from app.services.teachers import (
    get_all_teachers,
    get_single_teacher,
    create_new_teacher,
    update_existing_teacher,
    delete_existing_teacher
)
from app.api.deps import get_current_user
from app.database.models import User

router = APIRouter()

@router.post("/", response_model=TeacherInDB, status_code=status.HTTP_201_CREATED)
async def create_teacher(
    teacher: TeacherCreate,
    current_user: User = Depends(get_current_user)
):
    return create_new_teacher(teacher)

@router.get("/{teacher_id}", response_model=TeacherInDB)
async def read_teacher(
    teacher_id: UUID,
    current_user: User = Depends(get_current_user)
):
    teacher = get_single_teacher(teacher_id)
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher

@router.get("/", response_model=List[TeacherInDB])
async def read_teachers(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
):
    return get_all_teachers(skip=skip, limit=limit)

@router.put("/{teacher_id}", response_model=TeacherInDB)
async def update_teacher(
    teacher_id: UUID,
    teacher: TeacherUpdate,
    current_user: User = Depends(get_current_user)
):
    updated_teacher = update_existing_teacher(teacher_id, teacher)
    if not updated_teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return updated_teacher

@router.delete("/{teacher_id}", response_model=dict)
async def delete_teacher(
    teacher_id: UUID,
    current_user: User = Depends(get_current_user)
):
    success = delete_existing_teacher(teacher_id)
    if not success:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return {"message": "Teacher deleted successfully"}
