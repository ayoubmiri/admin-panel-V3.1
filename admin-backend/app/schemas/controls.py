# from pydantic import BaseModel, Field
# from typing import Optional
# from uuid import UUID
# from datetime import datetime

# class ControlBase(BaseModel):
#     element_id: UUID
#     academic_year: str
#     semester: str
#     control_type: str
#     date: datetime

# class ControlCreate(ControlBase):
#     pass

# class ControlUpdate(BaseModel):
#     element_id: Optional[UUID] = None
#     academic_year: Optional[str] = None
#     semester: Optional[str] = None
#     control_type: Optional[str] = None
#     date: Optional[datetime] = None

# class ControlInDB(ControlBase):
#     id: UUID
#     created_at: Optional[datetime]
#     updated_at: Optional[datetime]

#     class Config:
#         orm_mode = True



# # from pydantic import BaseModel, Field
# # from uuid import UUID
# # from datetime import datetime
# # from typing import Optional

# # class ControlBase(BaseModel):
# #     element_id: UUID
# #     academic_year: str
# #     semester: str
# #     control_type: str
# #     date: datetime

# # class ControlCreate(ControlBase):
# #     pass

# # class ControlUpdate(BaseModel):
# #     control_type: Optional[str] = None
# #     date: Optional[datetime] = None

# # class ControlInDB(ControlBase):
# #     id: UUID
# #     created_at: Optional[datetime]
# #     updated_at: Optional[datetime]

# #     class Config:
# #         orm_mode = True
