# from typing import List, Optional
# from uuid import UUID
# from app.schemas.controls import ControlCreate, ControlUpdate, ControlInDB
# from app.crud import controls as crud_controls

# def create_control(control: ControlCreate) -> ControlInDB:
#     return crud_controls.create_control(control)

# def get_control(element_id: UUID, academic_year: str, semester: str, control_id: UUID) -> Optional[ControlInDB]:
#     return crud_controls.get_control(element_id, academic_year, semester, control_id)

# def get_controls(
#     element_id: Optional[UUID] = None,
#     academic_year: Optional[str] = None,
#     semester: Optional[str] = None,
#     limit: int = 100
# ) -> List[ControlInDB]:
#     return crud_controls.get_controls(element_id, academic_year, semester, limit)

# def update_control(
#     element_id: UUID,
#     academic_year: str,
#     semester: str,
#     control_id: UUID,
#     control_update: ControlUpdate
# ) -> Optional[ControlInDB]:
#     return crud_controls.update_control(element_id, academic_year, semester, control_id, control_update)

# def delete_control(element_id: UUID, academic_year: str, semester: str, control_id: UUID) -> bool:
#     return crud_controls.delete_control(element_id, academic_year, semester, control_id)



# # from uuid import UUID, uuid1
# # from typing import List, Optional
# # from datetime import datetime
# # from collections import defaultdict
# # from typing import Dict

# # from app.database.models import Control
# # from app.schemas.controls import ControlCreate, ControlUpdate, ControlInDB

# # def get_controls(limit: int = 100) -> List[ControlInDB]:
# #     controls = Control.objects.limit(limit)
# #     return [ControlInDB(**c._asdict()) for c in controls]

# # def get_control(control_id: UUID) -> Optional[ControlInDB]:
# #     control = Control.objects(id=control_id).first()
# #     if not control:
# #         return None
# #     return ControlInDB(**control._asdict())

# # def create_control(control: ControlCreate) -> ControlInDB:
# #     now = datetime.utcnow()
# #     control_data = control.dict()
# #     control_data['id'] = uuid1()
# #     control_data['created_at'] = now
# #     control_data['updated_at'] = now
# #     new_control = Control.create(**control_data)
# #     return ControlInDB(**new_control._asdict())

# # def update_control(control_id: UUID, update: ControlUpdate) -> Optional[ControlInDB]:
# #     control = Control.objects(id=control_id).first()
# #     if not control:
# #         return None
# #     update_data = update.dict(exclude_unset=True)
# #     update_data['updated_at'] = datetime.utcnow()
# #     for key, value in update_data.items():
# #         setattr(control, key, value)
# #     control.save()
# #     return ControlInDB(**control._asdict())

# # def delete_control(control_id: UUID) -> bool:
# #     control = Control.objects(id=control_id).first()
# #     if not control:
# #         return False
# #     control.delete()
# #     return True


# # def get_controls_by_filters(academic_year: Optional[str] = None, semester: Optional[str] = None) -> List[ControlInDB]:
# #     query = Control.objects.all()
# #     if academic_year:
# #         query = query.filter(academic_year=academic_year)
# #     if semester:
# #         query = query.filter(semester=semester)
# #     return [ControlInDB(**c._asdict()) for c in query]

# # def get_controls_grouped_by_element() -> Dict[str, List[ControlInDB]]:
# #     controls = Control.objects.all()
# #     grouped = defaultdict(list)
# #     for control in controls:
# #         grouped[str(control.element_id)].append(ControlInDB(**control._asdict()))
# #     return grouped

# # def get_controls_by_filters_paginated(
# #     academic_year: Optional[str] = None,
# #     semester: Optional[str] = None,
# #     skip: int = 0,
# #     limit: int = 10
# # ) -> List[ControlInDB]:
# #     query = Control.objects.all()
# #     if academic_year:
# #         query = query.filter(academic_year=academic_year)
# #     if semester:
# #         query = query.filter(semester=semester)
# #     paginated = query[skip:skip + limit]
# #     return [ControlInDB(**c._asdict()) for c in paginated]
