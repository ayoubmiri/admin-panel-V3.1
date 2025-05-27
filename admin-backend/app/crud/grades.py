from uuid import UUID, uuid4
from datetime import datetime
from app.database.models import Grade
from app.schemas.grades import GradeCreateSchema, GradeUpdateSchema
from cassandra.cqlengine.management import sync_table



# sync_table(Grade)
def create_grade(data: GradeCreateSchema):
    grade = Grade.create(
        id=uuid4(),
        student_id=data.student_id,
        control_id=data.control_id,
        final_exam_id=data.final_exam_id,
        scores=data.scores.dict(),
        status=data.status,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    return grade

def get_grade(student_id: UUID, id: UUID):
    return Grade.get(student_id=student_id, id=id)

def get_all_grades_by_student(student_id: UUID):
    return Grade.objects(student_id=student_id).all()

def update_grade(student_id: UUID, id: UUID, data: GradeUpdateSchema):
    grade = Grade.get(student_id=student_id, id=id)
    if data.scores is not None:
        grade.scores = data.scores.dict()
    if data.status is not None:
        grade.status = data.status
    grade.updated_at = datetime.utcnow()
    grade.save()
    return grade

def delete_grade(student_id: UUID, id: UUID):
    grade = Grade.get(student_id=student_id, id=id)
    grade.delete()
    return True


