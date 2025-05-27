from typing import List, Optional
from uuid import UUID
from app.schemas.teachers import TeacherCreate, TeacherUpdate, TeacherInDB
from app.crud.teachers import (
    create_teacher,
    get_teacher,
    get_teachers,
    update_teacher,
    delete_teacher
)

def get_all_teachers(skip: int = 0, limit: int = 100) -> List[TeacherInDB]:
    return get_teachers(skip, limit)

def get_single_teacher(teacher_id: UUID) -> Optional[TeacherInDB]:
    return get_teacher(teacher_id)

def create_new_teacher(teacher: TeacherCreate) -> TeacherInDB:
    return create_teacher(teacher)

def update_existing_teacher(teacher_id: UUID, teacher: TeacherUpdate) -> Optional[TeacherInDB]:
    return update_teacher(teacher_id, teacher)

def delete_existing_teacher(teacher_id: UUID) -> bool:
    return delete_teacher(teacher_id)
