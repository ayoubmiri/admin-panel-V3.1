from fastapi import APIRouter, Depends, HTTPException
from app.services.students import *
from app.schemas.students import *
from app.services.auth import get_current_user, has_admin_role

router = APIRouter()

@router.post("/", response_model=StudentOut)
async def create_student(
    student: StudentCreate,
    current_user: dict = Depends(get_current_user)
):
    if not has_admin_role(current_user):
        raise HTTPException(
            status_code=403,
            detail="Admin privileges required"
        )
    return await create_student(student)

@router.get("/", response_model=list[StudentOut])
async def list_students(
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user)
):
    return await get_students(skip, limit)

@router.get("/{student_id}", response_model=StudentOut)
async def get_student_by_id(
    student_id: str,
    current_user: dict = Depends(get_current_user)
):
    student = await get_student(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/{student_id}", response_model=StudentOut)
async def update_student(
    student_id: str,
    student: StudentUpdate,
    current_user: dict = Depends(get_current_user)
):
    if not has_admin_role(current_user):
        raise HTTPException(
            status_code=403,
            detail="Admin privileges required"
        )
    return await update_student(student_id, student)

@router.delete("/{student_id}")
async def delete_student(
    student_id: str,
    current_user: dict = Depends(get_current_user)
):
    if not has_admin_role(current_user):
        raise HTTPException(
            status_code=403,
            detail="Admin privileges required"
        )
    await delete_student(student_id)
    return {"message": "Student deleted"}