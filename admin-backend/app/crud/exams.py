# from cassandra.cqlengine.query import DoesNotExist
# from datetime import datetime
# from uuid import uuid1, UUID
# from models.final_exam import FinalExam
# from schemas.final_exam import FinalExamCreateSchema, FinalExamUpdateSchema

# def create_final_exam(data: FinalExamCreateSchema):
#     return FinalExam.create(
#         element_id=data.element_id,
#         academic_year=data.academic_year,
#         semester=data.semester,
#         id=uuid1(),
#         date=data.date,
#         created_at=datetime.utcnow(),
#         updated_at=datetime.utcnow()
#     )

# def get_final_exam(element_id: UUID, academic_year: str, semester: str, id: UUID):
#     try:
#         return FinalExam.get(
#             element_id=element_id,
#             academic_year=academic_year,
#             semester=semester,
#             id=id
#         )
#     except DoesNotExist:
#         return None

# def list_final_exams(element_id: UUID, academic_year: str, semester: str):
#     return FinalExam.objects(
#         element_id=element_id,
#         academic_year=academic_year,
#         semester=semester
#     ).all()

# def update_final_exam(element_id: UUID, academic_year: str, semester: str, id: UUID, data: FinalExamUpdateSchema):
#     exam = get_final_exam(element_id, academic_year, semester, id)
#     if not exam:
#         return None
#     if data.date is not None:
#         exam.date = data.date
#     exam.updated_at = datetime.utcnow()
#     exam.save()
#     return exam

# def delete_final_exam(element_id: UUID, academic_year: str, semester: str, id: UUID):
#     exam = get_final_exam(element_id, academic_year, semester, id)
#     if not exam:
#         return None
#     exam.delete()
#     return True
