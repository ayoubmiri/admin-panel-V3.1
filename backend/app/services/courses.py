from cassandra.cqlengine.query import DoesNotExist
from uuid import UUID
from app.database.models import Course
from app.schemas.courses import CourseCreate, CourseUpdate

async def create_course(course: CourseCreate):
    course_data = course.dict()
    return Course.create(**course_data)

async def get_course_by_id(course_id: str):
    try:
        return Course.objects(id=UUID(course_id)).first()
    except DoesNotExist:
        return None

async def get_courses(skip: int = 0, limit: int = 100):
    return list(Course.objects.all()[skip:skip + limit])

async def update_course(course_id: str, course: CourseUpdate):
    existing = Course.objects(id=UUID(course_id)).first()
    if not existing:
        return None
    
    for field, value in course.dict(exclude_unset=True).items():
        setattr(existing, field, value)
    existing.save()
    return existing

async def delete_course(course_id: str):
    course = Course.objects(id=UUID(course_id)).first()
    if course:
        course.delete()