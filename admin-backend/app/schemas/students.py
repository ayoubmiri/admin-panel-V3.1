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



# from pydantic import BaseModel, EmailStr, Field
# from typing import Optional
# from uuid import UUID
# from datetime import date, datetime

# class StudentBase(BaseModel):
#     student_id: str = Field(..., description="Unique student identifier")
#     first_name: str
#     last_name: str
#     email: EmailStr
#     phone: Optional[str] = None
#     address: Optional[str] = None
#     date_of_birth: Optional[date] = None
#     filiere_id: UUID
#     class_id: Optional[UUID] = None
#     student_type: Optional[str] = None
#     year: Optional[str] = None
#     status: Optional[str] = "active"

# class StudentCreate(StudentBase):
#     pass

# class StudentUpdate(BaseModel):
#     student_id: Optional[str] = None
#     first_name: Optional[str] = None
#     last_name: Optional[str] = None
#     email: Optional[EmailStr] = None
#     phone: Optional[str] = None
#     address: Optional[str] = None
#     date_of_birth: Optional[date] = None
#     filiere_id: Optional[UUID] = None
#     class_id: Optional[UUID] = None
#     student_type: Optional[str] = None
#     year: Optional[str] = None
#     status: Optional[str] = None

# class StudentInDB(StudentBase):
#     id: UUID
#     created_at: datetime
#     updated_at: datetime








# from pydantic import BaseModel, EmailStr, Field, validator
# from typing import Optional
# from uuid import UUID
# from datetime import date, datetime
# from cassandra.cqlengine.usertype import Date

# class StudentBase(BaseModel):
#     student_id: str = Field(..., description="Unique student identifier")
#     first_name: str
#     last_name: str
#     email: EmailStr
#     phone: Optional[str] = None
#     address: Optional[str] = None
#     date_of_birth: Optional[date] = None
#     filiere_id: UUID
#     class_id: Optional[UUID] = None
#     student_type: Optional[str] = None
#     year: Optional[str] = None
#     status: Optional[str] = "active"

#     @validator('date_of_birth', pre=True)
#     def parse_date_of_birth(cls, value):
#         if value is None:
#             return value
#         if isinstance(value, str):
#             return date.fromisoformat(value)
#         if isinstance(value, Date):
#             return date(value.year, value.month, value.day)
#         raise ValueError("Invalid date format")

# class StudentCreate(StudentBase):
#     pass

# class StudentUpdate(BaseModel):
#     student_id: Optional[str] = None
#     first_name: Optional[str] = None
#     last_name: Optional[str] = None
#     email: Optional[EmailStr] = None
#     phone: Optional[str] = None
#     address: Optional[str] = None
#     date_of_birth: Optional[date] = None
#     filiere_id: Optional[UUID] = None
#     class_id: Optional[UUID] = None
#     student_type: Optional[str] = None
#     year: Optional[str] = None
#     status: Optional[str] = None

#     @validator('date_of_birth', pre=True)
#     def parse_date_of_birth(cls, value):
#         if value is None:
#             return value
#         if isinstance(value, str):
#             return date.fromisoformat(value)
#         if isinstance(value, Date):
#             return date(value.year, value.month, value.day)
#         raise ValueError("Invalid date format")

# class StudentInDB(StudentBase):
#     id: UUID
#     created_at: datetime
#     updated_at: datetime