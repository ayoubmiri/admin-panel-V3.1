import logging
from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime, date
from cassandra.cqlengine.management import sync_table
from cassandra.util import Date as CassandraDate
from app.database.models import Student
from app.schemas.students import StudentCreate, StudentUpdate, StudentInDB
from fastapi import HTTPException

# Configure logging
logging.basicConfig(level=logging.DEBUG, filename='app.log', filemode='a', format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Make sure the Cassandra table schema is synced (run once on startup)
# sync_table(Student)

# Helper function to convert Student model to dict
def student_to_dict(student: Student) -> dict:
    data = {c: getattr(student, c) for c in student._defined_columns}
    # Convert cassandra.util.Date to datetime.date for date_of_birth
    if data.get('date_of_birth') and isinstance(data['date_of_birth'], CassandraDate):
        data['date_of_birth'] = data['date_of_birth'].date()
    return data

def get_students(skip: int = 0, limit: int = 100) -> List[StudentInDB]:
    try:
        students = Student.objects.all()[skip:skip + limit]
        return [StudentInDB(**student_to_dict(s)) for s in students]
    except Exception as e:
        logger.exception(f"Failed to retrieve students: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve students: {str(e)}")

def get_student(student_id: UUID) -> Optional[StudentInDB]:
    try:
        student = Student.objects(id=student_id).first()
        return StudentInDB(**student_to_dict(student)) if student else None
    except Exception as e:
        logger.exception(f"Failed to retrieve student: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve student: {str(e)}")

def create_student(student: StudentCreate) -> StudentInDB:
    try:
        student_data = student.dict()
        logger.debug(f"Input data: {student_data}")
        student_data['id'] = uuid4()
        now = datetime.utcnow()
        student_data['created_at'] = now
        student_data['updated_at'] = now
        logger.debug(f"Data to save: {student_data}")
        new_student = Student.create(**student_data)
        return StudentInDB(**student_to_dict(new_student))
    except Exception as e:
        logger.exception(f"Failed to create student: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create student: {str(e)}")

def update_student(student_id: UUID, student: StudentUpdate) -> Optional[StudentInDB]:
    try:
        existing_student = Student.objects(id=student_id).first()
        if not existing_student:
            return None
        update_data = student.dict(exclude_unset=True)
        update_data['updated_at'] = datetime.utcnow()
        for key, value in update_data.items():
            setattr(existing_student, key, value)
        existing_student.save()
        return StudentInDB(**student_to_dict(existing_student))
    except Exception as e:
        logger.exception(f"Failed to update student: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update student: {str(e)}")

def delete_student(student_id: UUID) -> bool:
    try:
        student = Student.objects(id=student_id).first()
        if not student:
            return False
        student.delete()
        return True
    except Exception as e:
        logger.exception(f"Failed to delete student: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete student: {str(e)}")
