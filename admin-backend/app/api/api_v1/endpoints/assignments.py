from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.assignments import (
    TeacherElementAssignmentCreate,
    TeacherElementAssignmentUpdate,
    TeacherElementAssignmentSchema
)
from app.services import assignments as service

router = APIRouter(prefix="/assignments", tags=["Assignments"])

@router.post("/", response_model=TeacherElementAssignmentSchema, status_code=status.HTTP_201_CREATED)
def create_assignment(data: TeacherElementAssignmentCreate):
    return service.create_assignment_service(data)

@router.get(
    "/{filiere_id}/{module_id}/{element_id}/{class_id}/{academic_year}/{semester}",
    response_model=TeacherElementAssignmentSchema,
)
def get_assignment(
    filiere_id: str,
    module_id: str,
    element_id: str,
    class_id: str,
    academic_year: str,
    semester: str,
):
    assignment = service.get_assignment_service(
        filiere_id, module_id, element_id, class_id, academic_year, semester
    )
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment

@router.put(
    "/{filiere_id}/{module_id}/{element_id}/{class_id}/{academic_year}/{semester}",
    response_model=TeacherElementAssignmentSchema,
)
def update_assignment(
    filiere_id: str,
    module_id: str,
    element_id: str,
    class_id: str,
    academic_year: str,
    semester: str,
    data: TeacherElementAssignmentUpdate,
):
    updated = service.update_assignment_service(
        filiere_id, module_id, element_id, class_id, academic_year, semester, data
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return updated

@router.delete(
    "/{filiere_id}/{module_id}/{element_id}/{class_id}/{academic_year}/{semester}",
)
def delete_assignment(
    filiere_id: str,
    module_id: str,
    element_id: str,
    class_id: str,
    academic_year: str,
    semester: str,
):
    deleted = service.delete_assignment_service(
        filiere_id, module_id, element_id, class_id, academic_year, semester
    )
    if not deleted:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return {"success": True}

@router.get("/", response_model=List[TeacherElementAssignmentSchema])
def list_assignments():
    return service.list_assignments_service()
