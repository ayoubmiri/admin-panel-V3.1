from cassandra.cqlengine.query import DoesNotExist
from uuid import UUID
from app.database.models import Grade
from app.schemas.grades import GradeCreate, GradeUpdate

async def create_grade_entry(grade: GradeCreate):
    grade_data = grade.dict()
    return Grade.create(**grade_data)

async def get_grade_entry(grade_id: str):
    try:
        return Grade.objects(id=UUID(grade_id)).first()
    except DoesNotExist:
        return None

async def get_grades(student_id: str = None, course_id: str = None, skip: int = 0, limit: int = 100):
    query = Grade.objects.all()
    if student_id:
        query = query.filter(student_id=UUID(student_id))
    if course_id:
        query = query.filter(course_id=UUID(course_id))
    return list(query[skip:skip + limit])

async def update_grade_entry(grade_id: str, grade: GradeUpdate):
    existing = Grade.objects(id=UUID(grade_id)).first()
    if not existing:
        return None
    
    for field, value in grade.dict(exclude_unset=True).items():
        setattr(existing, field, value)
    existing.save()
    return existing

async def delete_grade_entry(grade_id: str):
    grade = Grade.objects(id=UUID(grade_id)).first()
    if grade:
        grade.delete()