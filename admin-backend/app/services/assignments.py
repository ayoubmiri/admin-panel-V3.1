from app.schemas.assignments import TeacherElementAssignmentCreate, TeacherElementAssignmentUpdate
from app.crud import assignments as crud
from typing import Optional

def create_assignment_service(data: TeacherElementAssignmentCreate):
    return crud.create_assignment(data)

def get_assignment_service(filiere_id, module_id, element_id, class_id, academic_year, semester) -> Optional:
    return crud.get_assignment(filiere_id, module_id, element_id, class_id, academic_year, semester)

def update_assignment_service(filiere_id, module_id, element_id, class_id, academic_year, semester, data: TeacherElementAssignmentUpdate) -> Optional:
    return crud.update_assignment(filiere_id, module_id, element_id, class_id, academic_year, semester, data)

def delete_assignment_service(filiere_id, module_id, element_id, class_id, academic_year, semester) -> bool:
    return crud.delete_assignment(filiere_id, module_id, element_id, class_id, academic_year, semester)

def list_assignments_service():
    return crud.list_assignments()
