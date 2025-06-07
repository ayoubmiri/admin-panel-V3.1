from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID
from datetime import date, datetime

class StudentBase(BaseModel):
    student_id: str = Field(..., description="Unique student identifier")
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    filiere_id: UUID
    class_id: Optional[UUID] = None
    student_type: Optional[str] = None
    year: Optional[str] = None
    status: Optional[str] = "active"

class StudentCreate(StudentBase):
    pass  # all fields required from base (except optionals remain optional)

class StudentUpdate(BaseModel):
    # all fields optional for partial update
    student_id: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    filiere_id: Optional[UUID] = None
    class_id: Optional[UUID] = None
    student_type: Optional[str] = None
    year: Optional[str] = None
    status: Optional[str] = None

class StudentInDB(StudentBase):
    id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    # class Config:
    #     orm_mode = True






# from pydantic import BaseModel, EmailStr
# from typing import Optional
# from uuid import UUID
# from datetime import date, datetime

# class StudentCreate(BaseModel):
#     student_id: Optional[str] = None
#     first_name: str
#     last_name: str
#     email: EmailStr
#     phone: Optional[str] = None
#     filiere_id: Optional[UUID] = None
#     class_id: Optional[str] = None
#     student_type: Optional[str] = None
#     year: Optional[str] = None
#     status: Optional[str] = None
#     address: Optional[str] = None
#     date_of_birth: Optional[date] = None
#     password: Optional[str] = None

# class StudentUpdate(BaseModel):
#     first_name: Optional[str] = None
#     last_name: Optional[str] = None
#     email: Optional[EmailStr] = None
#     phone: Optional[str] = None
#     filiere_id: Optional[UUID] = None
#     class_id: Optional[str] = None
#     student_type: Optional[str] = None
#     year: Optional[str] = None
#     status: Optional[str] = None
#     address: Optional[str] = None
#     date_of_birth: Optional[date] = None

# class StudentInDB(BaseModel):
#     id: UUID
#     student_id: str
#     first_name: str
#     last_name: str
#     email: EmailStr
#     phone: Optional[str]
#     filiere_id: Optional[UUID]
#     class_id: Optional[str]
#     student_type: Optional[str]
#     year: Optional[str]
#     status: Optional[str]
#     address: Optional[str]
#     date_of_birth: Optional[date]
#     created_at: datetime
#     updated_at: datetime
#     temporary_password: Optional[str] = None