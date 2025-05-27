# from typing import List, Optional
# from datetime import datetime
# from uuid import UUID
# from fastapi import HTTPException
# from cassandra.cqlengine.management import sync_table
# from cassandra.cqlengine.query import DoesNotExist

# from app.database.models import Control
# from app.schemas.controls import ControlCreate, ControlInDB, ControlUpdate

# # Sync table on import/startup
# # sync_table(Control)

# def create_control(control: ControlCreate) -> ControlInDB:
#     try:
#         new_control = Control.create(
#             element_id=control.element_id,
#             academic_year=control.academic_year,
#             semester=control.semester,
#             id=None,  # default generates automatically
#             control_type=control.control_type,
#             date=control.date,
#             created_at=datetime.utcnow(),
#             updated_at=datetime.utcnow(),
#         )
#         return ControlInDB.from_orm(new_control)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to create control: {str(e)}")

# def get_control(element_id: UUID, academic_year: str, semester: str, control_id: UUID) -> Optional[ControlInDB]:
#     try:
#         control = Control.objects.get(
#             element_id=element_id,
#             academic_year=academic_year,
#             semester=semester,
#             id=control_id,
#         )
#         return ControlInDB.from_orm(control)
#     except DoesNotExist:
#         return None
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to get control: {str(e)}")

# def get_controls(
#     element_id: Optional[UUID] = None,
#     academic_year: Optional[str] = None,
#     semester: Optional[str] = None,
#     limit: int = 100
# ) -> List[ControlInDB]:
#     try:
#         query = Control.objects
#         if element_id:
#             query = query.filter(element_id=element_id)
#         if academic_year:
#             query = query.filter(academic_year=academic_year)
#         if semester:
#             query = query.filter(semester=semester)

#         controls = query.limit(limit)
#         return [ControlInDB.from_orm(c) for c in controls]
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to retrieve controls: {str(e)}")

# def update_control(
#     element_id: UUID,
#     academic_year: str,
#     semester: str,
#     control_id: UUID,
#     control_update: ControlUpdate
# ) -> Optional[ControlInDB]:
#     try:
#         control = Control.objects.get(
#             element_id=element_id,
#             academic_year=academic_year,
#             semester=semester,
#             id=control_id
#         )
#         update_data = control_update.dict(exclude_unset=True)
#         for key, value in update_data.items():
#             setattr(control, key, value)
#         control.updated_at = datetime.utcnow()
#         control.save()
#         return ControlInDB.from_orm(control)
#     except DoesNotExist:
#         return None
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to update control: {str(e)}")

# def delete_control(element_id: UUID, academic_year: str, semester: str, control_id: UUID) -> bool:
#     try:
#         control = Control.objects.get(
#             element_id=element_id,
#             academic_year=academic_year,
#             semester=semester,
#             id=control_id
#         )
#         control.delete()
#         return True
#     except DoesNotExist:
#         return False
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to delete control: {str(e)}")



# # import uuid
# # from datetime import datetime
# # from cassandra.cqlengine.management import sync_table
# # from cassandra.cqlengine.query import DoesNotExist
# # from fastapi import HTTPException
# # from typing import List, Optional
# # from app.models import Control
# # from app.schemas.controls import ControlCreate, ControlUpdate, ControlInDB

# # # Sync table once
# # sync_table(Control)

# # def create_control(control: ControlCreate) -> ControlInDB:
# #     try:
# #         new_control = Control.create(
# #             element_id=control.element_id,
# #             academic_year=control.academic_year,
# #             semester=control.semester,
# #             id=uuid.uuid1(),  # TimeUUID
# #             control_type=control.control_type,
# #             date=control.date,
# #             created_at=datetime.utcnow(),
# #             updated_at=datetime.utcnow()
# #         )
# #         return ControlInDB.from_orm(new_control)
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=f"Failed to create control: {str(e)}")

# # def get_control(control_id: uuid.UUID) -> Optional[ControlInDB]:
# #     try:
# #         control = Control.objects.get(id=control_id)
# #         return ControlInDB.from_orm(control)
# #     except DoesNotExist:
# #         return None
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=f"Failed to retrieve control: {str(e)}")

# # def get_controls(limit: int = 100) -> List[ControlInDB]:
# #     try:
# #         controls = Control.objects.limit(limit)
# #         return [ControlInDB.from_orm(c) for c in controls]
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=f"Failed to retrieve controls: {str(e)}")

# # def update_control(control_id: uuid.UUID, update_data: ControlUpdate) -> Optional[ControlInDB]:
# #     try:
# #         control = Control.objects.get(id=control_id)
# #         data = update_data.dict(exclude_unset=True)
# #         for field, value in data.items():
# #             setattr(control, field, value)
# #         control.updated_at = datetime.utcnow()
# #         control.save()
# #         return ControlInDB.from_orm(control)
# #     except DoesNotExist:
# #         return None
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=f"Failed to update control: {str(e)}")

# # def delete_control(control_id: uuid.UUID) -> bool:
# #     try:
# #         control = Control.objects.get(id=control_id)
# #         control.delete()
# #         return True
# #     except DoesNotExist:
# #         return False
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=f"Failed to delete control: {str(e)}")
