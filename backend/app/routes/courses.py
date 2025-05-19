from fastapi import APIRouter, Depends, HTTPException
from app.services.courses import *
from app.schemas.courses import *
from app.services.auth import get_current_user, has_admin_role

router = APIRouter()

@router.post("/", response_model=CourseOut)
async def create_course(
    course: CourseCreate,
    current_user: dict = Depends(get_current_user)
):
    if not has_admin_role(current_user):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return await create_course(course)

@router.get("/", response_model=list[CourseOut])
async def list_courses(
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user)
):
    return await get_courses(skip, limit)

@router.get("/{course_id}", response_model=CourseOut)
async def get_course(
    course_id: str,
    current_user: dict = Depends(get_current_user)
):
    course = await get_course_by_id(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.put("/{course_id}", response_model=CourseOut)
async def update_course(
    course_id: str,
    course: CourseUpdate,
    current_user: dict = Depends(get_current_user)
):
    if not has_admin_role(current_user):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return await update_course(course_id, course)

@router.delete("/{course_id}")
async def delete_course(
    course_id: str,
    current_user: dict = Depends(get_current_user)
):
    if not has_admin_role(current_user):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    await delete_course(course_id)
    return {"message": "Course deleted"}