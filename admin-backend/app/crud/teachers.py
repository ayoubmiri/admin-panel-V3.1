from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime
from cassandra.cqlengine.management import sync_table
from cassandra.cqlengine.query import DoesNotExist
from app.database.models import Teacher
from app.schemas.teachers import TeacherCreate, TeacherUpdate, TeacherInDB
from fastapi import HTTPException

# sync_table(Teacher)  # Uncomment to sync table

def get_teacher(teacher_id: UUID) -> Optional[TeacherInDB]:
    try:
        teacher = Teacher.objects(id=teacher_id).first()
        return TeacherInDB(**teacher._asdict()) if teacher else None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving teacher: {e}")

def get_teachers(skip: int = 0, limit: int = 100) -> List[TeacherInDB]:
    try:
        teachers = Teacher.objects.all()[skip:skip + limit]
        return [TeacherInDB(**t._asdict()) for t in teachers]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving teachers: {e}")

def create_teacher(teacher: TeacherCreate) -> TeacherInDB:
    try:
        teacher_data = teacher.dict()
        teacher_data['id'] = uuid4()
        new_teacher = Teacher.create(**teacher_data)
        return TeacherInDB(**new_teacher._asdict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating teacher: {e}")

def update_teacher(teacher_id: UUID, teacher: TeacherUpdate) -> Optional[TeacherInDB]:
    try:
        existing_teacher = Teacher.objects(id=teacher_id).first()
        if not existing_teacher:
            return None

        update_data = teacher.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(existing_teacher, key, value)
        existing_teacher.save()
        return TeacherInDB(**existing_teacher._asdict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating teacher: {e}")

def delete_teacher(teacher_id: UUID) -> bool:
    try:
        teacher = Teacher.objects(id=teacher_id).first()
        if not teacher:
            return False
        teacher.delete()
        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting teacher: {e}")


