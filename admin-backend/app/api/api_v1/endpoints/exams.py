# from fastapi import APIRouter, HTTPException
# from typing import List
# from uuid import UUID
# from schemas.final_exam import (
#     FinalExamCreateSchema,
#     FinalExamUpdateSchema,
#     FinalExamSchema
# )
# from services import final_exam as service

# router = APIRouter(prefix="/final-exams", tags=["Final Exams"])

# @router.post("/", response_model=FinalExamSchema)
# def create_final_exam(data: FinalExamCreateSchema):
#     return service.create_final_exam_service(data)

# @router.get("/{element_id}/{academic_year}/{semester}/{id}", response_model=FinalExamSchema)
# def get_final_exam(element_id: UUID, academic_year: str, semester: str, id: UUID):
#     exam = service.get_final_exam_service(element_id, academic_year, semester, id)
#     if not exam:
#         raise HTTPException(status_code=404, detail="Final exam not found")
#     return exam

# @router.get("/{element_id}/{academic_year}/{semester}", response_model=List[FinalExamSchema])
# def list_final_exams(element_id: UUID, academic_year: str, semester: str):
#     return service.list_final_exams_service(element_id, academic_year, semester)

# @router.put("/{element_id}/{academic_year}/{semester}/{id}", response_model=FinalExamSchema)
# def update_final_exam(element_id: UUID, academic_year: str, semester: str, id: UUID, data: FinalExamUpdateSchema):
#     updated = service.update_final_exam_service(element_id, academic_year, semester, id, data)
#     if not updated:
#         raise HTTPException(status_code=404, detail="Final exam not found")
#     return updated

# @router.delete("/{element_id}/{academic_year}/{semester}/{id}")
# def delete_final_exam(element_id: UUID, academic_year: str, semester: str, id: UUID):
#     deleted = service.delete_final_exam_service(element_id, academic_year, semester, id)
#     if not deleted:
#         raise HTTPException(status_code=404, detail="Final exam not found")
#     return {"success": True}
