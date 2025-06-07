from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import get_current_user
from app.schemas.students import StudentInDB, StudentCreate, StudentUpdate
from app.services.students import (
    create_student,
    get_student,
    get_students,
    update_student,
    delete_student
)
from app.database.models import User

router = APIRouter()

@router.post("/", response_model=StudentInDB, status_code=status.HTTP_201_CREATED)
async def create_new_student(
    student: StudentCreate,
    current_user: User = Depends(get_current_user)
):
    return create_student(student)

@router.get("/{student_id}", response_model=StudentInDB)
async def read_student(
    student_id: UUID,
    current_user: User = Depends(get_current_user)
):
    student = get_student(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.get("/", response_model=List[StudentInDB])
async def read_students(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
):
    return get_students(skip=skip, limit=limit)

@router.put("/{student_id}", response_model=StudentInDB)
async def update_existing_student(
    student_id: UUID,
    student: StudentUpdate,
    current_user: User = Depends(get_current_user)
):
    updated_student = update_student(student_id, student)
    if not updated_student:
        raise HTTPException(status_code=404, detail="Student not found")
    return updated_student

@router.delete("/{student_id}", response_model=dict)
async def delete_existing_student(
    student_id: UUID,
    current_user: User = Depends(get_current_user)
):
    success = delete_student(student_id)
    if not success:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student deleted successfully"}





# from uuid import UUID
# from typing import List
# from fastapi import APIRouter, Depends, HTTPException, status
# from app.api.deps import  get_current_user
# from app.schemas.students import StudentInDB, StudentCreate, StudentUpdate
# from app.services.students import create_student, get_student, get_students, update_student, delete_student

# router = APIRouter()

# @router.post("/", response_model=StudentInDB, status_code=status.HTTP_201_CREATED)
# def create_new_student(student: StudentCreate, current_user: dict = Depends(get_current_user)):
#     if "admin" not in current_user.get("roles", []):
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
#     return create_student(student)

# @router.get("/{student_id}", response_model=StudentInDB)
# def read_student(student_id: UUID, current_user: dict = Depends(get_current_user)):
#     if "admin" not in current_user.get("roles", []):
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
#     student = get_student(student_id)
#     if not student:
#         raise HTTPException(status_code=404, detail="Student not found")
#     return student

# @router.get("/", response_model=List[StudentInDB])
# def read_students(skip: int = 0, limit: int = 100, current_user: dict = Depends(get_current_user)):
#     if "admin" not in current_user.get("roles", []):
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
#     return get_students(skip=skip, limit=limit)

# @router.put("/{student_id}", response_model=StudentInDB)
# def update_existing_student(student_id: UUID, student: StudentUpdate, current_user: dict = Depends(get_current_user)):
#     if "admin" not in current_user.get("roles", []):
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
#     updated_student = update_student(student_id, student)
#     if not updated_student:
#         raise HTTPException(status_code=404, detail="Student not found")
#     return updated_student

# @router.delete("/{student_id}", response_model=dict)
# def delete_existing_student(student_id: UUID, current_user: dict = Depends(get_current_user)):
#     if "admin" not in current_user.get("roles", []):
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
#     success = delete_student(student_id)
#     if not success:
#         raise HTTPException(status_code=404, detail="Student not found")
#     return {"message": "Student deleted successfully"}