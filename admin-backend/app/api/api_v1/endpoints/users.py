from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.user import UserCreate, UserUpdate, UserInDB
from app.services.user import (
    get_users as service_get_users,
    get_user as service_get_user,
    create_user as service_create_user,
    update_user as service_update_user,
    delete_user as service_delete_user
)
from app.api.deps import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[UserInDB])
def read_users(
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_active_user)
):
    users = service_get_users(skip=skip, limit=limit)
    return users

@router.post("/", response_model=UserInDB, status_code=201)
def create_user(
    user: UserCreate,
    current_user: dict = Depends(get_current_active_user)
):
    return service_create_user(user)

@router.get("/{user_id}", response_model=UserInDB)
def read_user(
    user_id: UUID,
    current_user: dict = Depends(get_current_active_user)
):
    user = service_get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserInDB)
def update_user(
    user_id: UUID,
    user: UserUpdate,
    current_user: dict = Depends(get_current_active_user)
):
    db_user = service_get_user(user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return service_update_user(user_id, user)

@router.delete("/{user_id}")
def delete_user(
    user_id: UUID,
    current_user: dict = Depends(get_current_active_user)
):
    db_user = service_get_user(user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    service_delete_user(user_id)
    return {"message": "User deleted successfully"}