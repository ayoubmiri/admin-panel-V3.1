from cassandra.cqlengine.query import DoesNotExist
from app.database.models import Student
from app.schemas.students import StudentCreate, StudentUpdate
from uuid import UUID

async def create_student(student: StudentCreate):
    student_data = student.dict()
    return Student.create(**student_data)

async def get_student(student_id: str):
    try:
        return Student.objects(student_id=student_id).first()
    except DoesNotExist:
        return None

async def get_students(skip: int = 0, limit: int = 100):
    return list(Student.objects.all()[skip:skip + limit])

async def update_student(student_id: str, student: StudentUpdate):
    existing = Student.objects(student_id=student_id).first()
    if not existing:
        return None
    
    for field, value in student.dict(exclude_unset=True).items():
        setattr(existing, field, value)
    existing.save()
    return existing

async def delete_student(student_id: str):
    student = Student.objects(student_id=student_id).first()
    if student:
        student.delete()