# from fastapi import APIRouter, HTTPException
# from app.schemas.grades import GradeCreateSchema, GradeUpdateSchema, GradeSchema
# from app.services import grades as grade_service
# from uuid import UUID
# from typing import List

# router = APIRouter(prefix="/grades", tags=["Grades"])

# @router.post("/", response_model=GradeSchema)
# def create_grade(data: GradeCreateSchema):
#     return grade_service.create_grade_service(data)

# @router.get("/{student_id}/{id}", response_model=GradeSchema)
# def get_grade(student_id: UUID, id: UUID):
#     return grade_service.get_grade_service(student_id, id)

# @router.get("/{student_id}", response_model=List[GradeSchema])
# def list_grades(student_id: UUID):
#     return grade_service.get_all_grades_by_student_service(student_id)

# @router.put("/{student_id}/{id}", response_model=GradeSchema)
# def update_grade(student_id: UUID, id: UUID, data: GradeUpdateSchema):
#     return grade_service.update_grade_service(student_id, id, data)

# @router.delete("/{student_id}/{id}")
# def delete_grade(student_id: UUID, id: UUID):
#     result = grade_service.delete_grade_service(student_id, id)
#     return {"success": result}
