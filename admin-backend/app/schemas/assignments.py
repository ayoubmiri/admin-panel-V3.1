from pydantic import BaseModel, UUID4
from typing import Optional

class TeacherElementAssignmentBase(BaseModel):
    teacher_id: UUID4
    filiere_id: UUID4
    module_id: UUID4
    element_id: UUID4
    class_id: UUID4
    academic_year: str
    semester: str

class TeacherElementAssignmentCreate(TeacherElementAssignmentBase):
    pass

class TeacherElementAssignmentUpdate(BaseModel):
    # all fields are optional for update (if any update fields needed)
    teacher_id: Optional[UUID4]
    # other fields can be included if needed

class TeacherElementAssignmentSchema(TeacherElementAssignmentBase):
    class Config:
        orm_mode = True
