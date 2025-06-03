from typing import List, Optional
from uuid import UUID
import logging

from app.schemas.students import StudentCreate, StudentUpdate, StudentInDB
from app.crud.students import (
    get_student as crud_get_student,
    create_student as crud_create_student,
    get_students as crud_get_students,
    update_student as crud_update_student,
    delete_student as crud_delete_student,
)

logging.basicConfig(level=logging.DEBUG, filename='app.log')
logger = logging.getLogger(__name__)


def get_students(skip: int = 0, limit: int = 100) -> List[StudentInDB]:
    return crud_get_students(skip=skip, limit=limit)

def get_student(student_id: UUID) -> Optional[StudentInDB]:
    return crud_get_student(student_id)

def create_student(student: StudentCreate) -> StudentInDB:
    logger.debug(f"Calling crud_create_student with data: {student.dict()}")
    return crud_create_student(student)

def update_student(student_id: UUID, student: StudentUpdate) -> Optional[StudentInDB]:
    return crud_update_student(student_id, student)

def delete_student(student_id: UUID) -> bool:
    return crud_delete_student(student_id)
