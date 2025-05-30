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



# from typing import List, Optional
# from uuid import UUID

# from app.schemas.students import StudentCreate, StudentUpdate, StudentInDB
# from app.crud.students import ( get_student, create_student, get_students,update_student,delete_student)


# def get_students(skip: int = 0, limit: int = 100) -> List[StudentInDB]:
#     # The current CRUD get_students doesn't support skip. Add it if needed.
#     return get_students(limit=limit)


# def get_student(student_id: UUID) -> Optional[StudentInDB]:
#     return get_student(student_id)


# def create_student(student: StudentCreate) -> StudentInDB:
#     return create_student(student)


# def update_student(student_id: UUID, student: StudentUpdate) -> Optional[StudentInDB]:
#     return update_student(student_id, student)


# def delete_student(student_id: UUID) -> bool:
#     return delete_student(student_id)



# from typing import List, Optional
# from uuid import UUID, uuid4
# from datetime import datetime
# from cassandra.cqlengine.management import sync_table
# from app.database.models import Student
# from app.schemas.students import StudentCreate, StudentUpdate, StudentInDB


# # Make sure the Cassandra table schema is synced (run once on startup)
# # sync_table(Student)


# def get_students(skip: int = 0, limit: int = 100) -> List[StudentInDB]:
#     students = Student.objects.all()[skip:skip + limit]
#     return [StudentInDB(**student._asdict()) for student in students]


# def get_student(student_id: UUID) -> Optional[StudentInDB]:
#     student = Student.objects(id=student_id).first()
#     if not student:
#         return None
#     return StudentInDB(**student._asdict())


# def create_student(student: StudentCreate) -> StudentInDB:
#     student_data = student.dict()
#     student_data['id'] = uuid4()
#     now = datetime.utcnow()
#     student_data['created_at'] = now
#     student_data['updated_at'] = now
#     new_student = Student.create(**student_data)
#     return StudentInDB(**new_student._asdict())


# def update_student(student_id: UUID, student: StudentUpdate) -> Optional[StudentInDB]:
#     existing_student = Student.objects(id=student_id).first()
#     if not existing_student:
#         return None

#     update_data = student.dict(exclude_unset=True)
#     update_data['updated_at'] = datetime.utcnow()

#     for key, value in update_data.items():
#         setattr(existing_student, key, value)
#     existing_student.save()
#     return StudentInDB(**existing_student._asdict())


# def delete_student(student_id: UUID) -> bool:
#     student = Student.objects(id=student_id).first()
#     if not student:
#         return False
#     student.delete()
#     return True
