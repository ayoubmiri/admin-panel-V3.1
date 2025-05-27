from cassandra.cqlengine.query import DoesNotExist
from app.database.models import TeacherElementAssignment
from app.schemas.assignments import TeacherElementAssignmentCreate, TeacherElementAssignmentUpdate
from typing import Optional

def create_assignment(data: TeacherElementAssignmentCreate) -> TeacherElementAssignment:
    return TeacherElementAssignment.create(
        teacher_id=data.teacher_id,
        filiere_id=data.filiere_id,
        module_id=data.module_id,
        element_id=data.element_id,
        class_id=data.class_id,
        academic_year=data.academic_year,
        semester=data.semester
    )

def get_assignment(
    filiere_id, module_id, element_id, class_id, academic_year, semester
) -> Optional[TeacherElementAssignment]:
    try:
        return TeacherElementAssignment.get(
            filiere_id=filiere_id,
            module_id=module_id,
            element_id=element_id,
            class_id=class_id,
            academic_year=academic_year,
            semester=semester
        )
    except DoesNotExist:
        return None

def delete_assignment(
    filiere_id, module_id, element_id, class_id, academic_year, semester
) -> bool:
    assignment = get_assignment(filiere_id, module_id, element_id, class_id, academic_year, semester)
    if not assignment:
        return False
    assignment.delete()
    return True

def update_assignment(
    filiere_id, module_id, element_id, class_id, academic_year, semester, data: TeacherElementAssignmentUpdate
) -> Optional[TeacherElementAssignment]:
    assignment = get_assignment(filiere_id, module_id, element_id, class_id, academic_year, semester)
    if not assignment:
        return None
    if data.teacher_id:
        assignment.teacher_id = data.teacher_id
    # Add other update fields here if needed
    assignment.save()
    return assignment

def list_assignments():
    return TeacherElementAssignment.objects().all()
