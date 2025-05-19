from cassandra.cqlengine.query import DoesNotExist
from app.database.models import Teacher
from app.schemas.teachers import TeacherCreate, TeacherUpdate

async def create_teacher(teacher: TeacherCreate):
    teacher_data = teacher.dict()
    return Teacher.create(**teacher_data)

async def get_teacher_by_id(teacher_id: str):
    try:
        return Teacher.objects(teacher_id=teacher_id).first()
    except DoesNotExist:
        return None

async def get_teachers(skip: int = 0, limit: int = 100):
    return list(Teacher.objects.all()[skip:skip + limit])

async def update_teacher(teacher_id: str, teacher: TeacherUpdate):
    existing = Teacher.objects(teacher_id=teacher_id).first()
    if not existing:
        return None
    
    for field, value in teacher.dict(exclude_unset=True).items():
        setattr(existing, field, value)
    existing.save()
    return existing

async def delete_teacher(teacher_id: str):
    teacher = Teacher.objects(teacher_id=teacher_id).first()
    if teacher:
        teacher.delete()