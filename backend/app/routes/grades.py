from fastapi import APIRouter, Depends, HTTPException
from app.services.grades import *
from app.schemas.grades import *
from app.services.auth import get_current_user, has_admin_role

router = APIRouter()

@router.post("/", response_model=GradeOut)
async def create_grade(
    grade: GradeCreate,
    current_user: dict = Depends(get_current_user)
):
    if not has_admin_role(current_user):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return await create_grade_entry(grade)

@router.get("/", response_model=list[GradeOut])
async def list_grades(
    student_id: Optional[str] = None,
    course_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user)
):
    return await get_grades(student_id, course_id, skip, limit)

@router.get("/{grade_id}", response_model=GradeOut)
async def get_grade(
    grade_id: str,
    current_user: dict = Depends(get_current_user)
):
    grade = await get_grade_entry(grade_id)
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    return grade

@router.put("/{grade_id}", response_model=GradeOut)
async def update_grade(
    grade_id: str,
    grade: GradeUpdate,
    current_user: dict = Depends(get_current_user)
):
    if not has_admin_role(current_user):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return await update_grade_entry(grade_id, grade)

@router.delete("/{grade_id}")
async def delete_grade(
    grade_id: str,
    current_user: dict = Depends(get_current_user)
):
    if not has_admin_role(current_user):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    await delete_grade_entry(grade_id)
    return {"message": "Grade deleted"}