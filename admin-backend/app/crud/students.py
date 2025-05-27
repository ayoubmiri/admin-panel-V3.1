from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime
from cassandra.cqlengine.management import sync_table
from app.database.models import Student
from app.schemas.students import StudentCreate, StudentUpdate, StudentInDB
from fastapi import HTTPException



# Make sure the Cassandra table schema is synced (run once on startup)
# sync_table(Student)

def get_students(skip: int = 0, limit: int = 100) -> List[StudentInDB]:
    try:
        students = Student.objects.all()[skip:skip + limit]
        return [StudentInDB.from_orm(s) for s in students]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve students: {str(e)}")


def get_student(student_id: UUID) -> Optional[StudentInDB]:
    student = Student.objects(id=student_id).first()
    if not student:
        return None
    return StudentInDB(**student._asdict())


def create_student(student: StudentCreate) -> StudentInDB:
    student_data = student.dict()
    student_data['id'] = uuid4()
    now = datetime.utcnow()
    student_data['created_at'] = now
    student_data['updated_at'] = now
    new_student = Student.create(**student_data)
    return StudentInDB(**new_student._asdict())


def update_student(student_id: UUID, student: StudentUpdate) -> Optional[StudentInDB]:
    existing_student = Student.objects(id=student_id).first()
    if not existing_student:
        return None

    update_data = student.dict(exclude_unset=True)
    update_data['updated_at'] = datetime.utcnow()

    for key, value in update_data.items():
        setattr(existing_student, key, value)
    existing_student.save()
    return StudentInDB(**existing_student._asdict())


def delete_student(student_id: UUID) -> bool:
    student = Student.objects(id=student_id).first()
    if not student:
        return False
    student.delete()
    return True




# import uuid
# from datetime import datetime, date
# from typing import List, Optional
# from cassandra.cqlengine.management import sync_table
# from cassandra.cqlengine.models import Model
# from cassandra.cqlengine.query import DoesNotExist
# from fastapi import HTTPException
# from app.models import Student  # your ORM model
# from app.schemas.students import StudentCreate, StudentInDB, StudentUpdate  # your Pydantic schemas

# # Ensure your table schema is synced
# sync_table(Student)

# def create_student(student: StudentCreate) -> StudentInDB:
#     try:
#         # Convert date_of_birth to datetime.date if it's str in schema
#         dob = student.date_of_birth
#         if isinstance(dob, str):
#             dob = date.fromisoformat(dob)
        
#         new_student = Student.create(
#             id=uuid.uuid1(),
#             student_id=student.student_id,
#             first_name=student.first_name,
#             last_name=student.last_name,
#             email=student.email,
#             phone=student.phone,
#             address=student.address,
#             date_of_birth=dob,
#             filiere_id=student.filiere_id,
#             class_id=student.class_id,
#             student_type=student.student_type,
#             year=student.year,
#             status=student.status or 'active',
#             created_at=datetime.utcnow(),
#             updated_at=datetime.utcnow()
#         )
#         return StudentInDB.from_orm(new_student)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to create student: {str(e)}")


# def get_student(student_id: uuid.UUID) -> Optional[StudentInDB]:
#     try:
#         student = Student.objects.get(id=student_id)
#         return StudentInDB.from_orm(student)
#     except DoesNotExist:
#         return None
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to retrieve student: {str(e)}")


# def get_students(limit: int = 100) -> List[StudentInDB]:
#     try:
#         students = Student.objects.limit(limit)
#         return [StudentInDB.from_orm(s) for s in students]
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to retrieve students: {str(e)}")


# def update_student(student_id: uuid.UUID, student_update: StudentUpdate) -> Optional[StudentInDB]:
#     try:
#         student = Student.objects.get(id=student_id)
        
#         update_data = student_update.dict(exclude_unset=True)
        
#         if 'date_of_birth' in update_data and isinstance(update_data['date_of_birth'], str):
#             update_data['date_of_birth'] = date.fromisoformat(update_data['date_of_birth'])
        
#         for field, value in update_data.items():
#             setattr(student, field, value)
        
#         student.updated_at = datetime.utcnow()
#         student.save()
        
#         return StudentInDB.from_orm(student)
#     except DoesNotExist:
#         return None
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to update student: {str(e)}")


# def delete_student(student_id: uuid.UUID) -> bool:
#     try:
#         student = Student.objects.get(id=student_id)
#         student.delete()
#         return True
#     except DoesNotExist:
#         return False
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to delete student: {str(e)}")





# import uuid
# from datetime import datetime
# from typing import List, Optional
# from cassandra.cluster import Session
# from cassandra.query import SimpleStatement
# from fastapi import HTTPException
# from app.schemas.students import StudentCreate, StudentInDB, StudentUpdate

# def create_student(session: Session, student: StudentCreate) -> StudentInDB:
#     try:
#         student_id = uuid.uuid4()
#         created_at = updated_at = datetime.utcnow().isoformat()
#         query = """
#         INSERT INTO students (
#             id, student_id, first_name, last_name, email, 
#             phone, program, year, status, address, 
#             date_of_birth, created_at, updated_at
#         ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
#         """
#         session.execute(SimpleStatement(query), (
#             student_id, student.student_id, student.first_name, student.last_name,
#             student.email, student.phone, student.program, student.year, student.status,
#             student.address, student.date_of_birth, created_at, updated_at
#         ))
#         return StudentInDB(
#             id=student_id, student_id=student.student_id, first_name=student.first_name,
#             last_name=student.last_name, email=student.email, phone=student.phone,
#             program=student.program, year=student.year, status=student.status,
#             address=student.address, date_of_birth=student.date_of_birth,
#             created_at=created_at, updated_at=updated_at
#         )
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to create student: {str(e)}")

# def get_student(session: Session, student_id: uuid.UUID) -> Optional[StudentInDB]:
#     try:
#         query = "SELECT * FROM students WHERE id = %s"
#         result = session.execute(SimpleStatement(query), [student_id])
#         row = result.one()
#         if row:
#             return StudentInDB(**row)
#         return None
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to retrieve student: {str(e)}")

# def get_students(session: Session, skip: int = 0, limit: int = 100) -> List[StudentInDB]:
#     try:
#         query = "SELECT * FROM students LIMIT %s OFFSET %s"
#         result = session.execute(SimpleStatement(query), [limit, skip])
#         return [StudentInDB(**row) for row in result]
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to retrieve students: {str(e)}")

# def update_student(session: Session, student_id: uuid.UUID, student: StudentUpdate) -> Optional[StudentInDB]:
#     try:
#         existing_student = get_student(session, student_id)
#         if not existing_student:
#             return None
#         updated_at = datetime.utcnow().isoformat()
#         fields = []
#         values = []
#         for field, value in student.dict(exclude_unset=True).items():
#             if value is not None:
#                 fields.append(f"{field} = %s")
#                 values.append(value)
#         if not fields:
#             return existing_student
#         fields.append("updated_at = %s")
#         values.append(updated_at)
#         values.append(student_id)
#         query = f"UPDATE students SET {', '.join(fields)} WHERE id = %s"
#         session.execute(SimpleStatement(query), values)
#         return get_student(session, student_id)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to update student: {str(e)}")

# def delete_student(session: Session, student_id: uuid.UUID) -> bool:
#     try:
#         query = "DELETE FROM students WHERE id = %s"
#         session.execute(SimpleStatement(query), [student_id])
#         return True
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to delete student: {str(e)}")