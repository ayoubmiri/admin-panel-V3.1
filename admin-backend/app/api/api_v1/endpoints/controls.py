from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.controls import ControlInDB, ControlCreate, ControlUpdate
from app.services import controls as services_controls
from app.database.models import User
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=ControlInDB, status_code=status.HTTP_201_CREATED)
async def create_new_control(
    control: ControlCreate,
    current_user: User = Depends(get_current_user)
):
    return services_controls.create_control(control)

@router.get("/", response_model=List[ControlInDB])
async def read_controls(
    element_id: Optional[UUID] = None,
    academic_year: Optional[str] = None,
    semester: Optional[str] = None,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
):
    return services_controls.get_controls(element_id, academic_year, semester, limit)

@router.get("/{element_id}/{academic_year}/{semester}/{control_id}", response_model=ControlInDB)
async def read_control(
    element_id: UUID,
    academic_year: str,
    semester: str,
    control_id: UUID,
    current_user: User = Depends(get_current_user)
):
    control = services_controls.get_control(element_id, academic_year, semester, control_id)
    if not control:
        raise HTTPException(status_code=404, detail="Control not found")
    return control

@router.put("/{element_id}/{academic_year}/{semester}/{control_id}", response_model=ControlInDB)
async def update_existing_control(
    element_id: UUID,
    academic_year: str,
    semester: str,
    control_id: UUID,
    control: ControlUpdate,
    current_user: User = Depends(get_current_user)
):
    updated_control = services_controls.update_control(element_id, academic_year, semester, control_id, control)
    if not updated_control:
        raise HTTPException(status_code=404, detail="Control not found")
    return updated_control

@router.delete("/{element_id}/{academic_year}/{semester}/{control_id}", response_model=dict)
async def delete_existing_control(
    element_id: UUID,
    academic_year: str,
    semester: str,
    control_id: UUID,
    current_user: User = Depends(get_current_user)
):
    success = services_controls.delete_control(element_id, academic_year, semester, control_id)
    if not success:
        raise HTTPException(status_code=404, detail="Control not found")
    return {"message": "Control deleted successfully"}


# from fastapi import APIRouter, Depends, HTTPException, status
# from typing import List
# from uuid import UUID
# from typing import Optional, Dict

# from app.api.deps import get_current_user
# from app.database.models import User
# from app.schemas.controls import ControlCreate, ControlUpdate, ControlInDB
# from app.services.controls import (
#     create_control,
#     get_control,
#     get_controls,
#     update_control,
#     delete_control,
# )

# router = APIRouter()

# @router.post("/", response_model=ControlInDB, status_code=status.HTTP_201_CREATED)
# def create_new_control(control: ControlCreate, current_user: User = Depends(get_current_user)):
#     return create_control(control)

# @router.get("/", response_model=List[ControlInDB])
# def read_controls(current_user: User = Depends(get_current_user)):
#     return get_controls()

# @router.get("/{control_id}", response_model=ControlInDB)
# def read_control(control_id: UUID, current_user: User = Depends(get_current_user)):
#     control = get_control(control_id)
#     if not control:
#         raise HTTPException(status_code=404, detail="Control not found")
#     return control

# @router.put("/{control_id}", response_model=ControlInDB)
# def update_existing_control(
#     control_id: UUID, update: ControlUpdate, current_user: User = Depends(get_current_user)
# ):
#     updated_control = update_control(control_id, update)
#     if not updated_control:
#         raise HTTPException(status_code=404, detail="Control not found")
#     return updated_control

# @router.delete("/{control_id}", response_model=dict)
# def delete_existing_control(control_id: UUID, current_user: User = Depends(get_current_user)):
#     success = delete_control(control_id)
#     if not success:
#         raise HTTPException(status_code=404, detail="Control not found")
#     return {"message": "Control deleted successfully"}


# @router.get("/filter", response_model=List[ControlInDB])
# def filter_controls(
#     academic_year: Optional[str] = None,
#     semester: Optional[str] = None,
#     current_user: User = Depends(get_current_user)
# ):
#     return get_controls_by_filters(academic_year, semester)

# @router.get("/group-by-element", response_model=Dict[str, List[ControlInDB]])
# def group_controls_by_element(current_user: User = Depends(get_current_user)):
#     return get_controls_grouped_by_element()

# @router.get("/filter/paginated", response_model=List[ControlInDB])
# def filter_controls_paginated(
#     academic_year: Optional[str] = None,
#     semester: Optional[str] = None,
#     skip: int = 0,
#     limit: int = 10,
#     current_user: User = Depends(get_current_user)
# ):
#     return get_controls_by_filters_paginated(academic_year, semester, skip, limit)
