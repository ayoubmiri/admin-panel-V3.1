from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.filieres import FiliereCreate, FiliereUpdate, FiliereInDB
from app.services.filieres import (
    list_filieres,
    retrieve_filiere,
    create_new_filiere,
    update_existing_filiere,
    delete_existing_filiere
)
from app.api.deps import get_current_user
from app.database.models import User

router = APIRouter()

@router.get("/", response_model=List[FiliereInDB])
async def get_all_filieres(
    skip: int = 0, limit: int = 100,
    current_user: User = Depends(get_current_user)
):
    return list_filieres(skip, limit)

@router.get("/{filiere_id}", response_model=FiliereInDB)
async def get_filiere_by_id(
    filiere_id: UUID,
    current_user: User = Depends(get_current_user)
):
    filiere = retrieve_filiere(filiere_id)
    if not filiere:
        raise HTTPException(status_code=404, detail="Filière not found")
    return filiere

@router.post("/", response_model=FiliereInDB, status_code=status.HTTP_201_CREATED)
async def create_filiere_endpoint(
    filiere: FiliereCreate,
    current_user: User = Depends(get_current_user)
):
    return create_new_filiere(filiere)

@router.put("/{filiere_id}", response_model=FiliereInDB)
async def update_filiere_endpoint(
    filiere_id: UUID,
    filiere: FiliereUpdate,
    current_user: User = Depends(get_current_user)
):
    updated = update_existing_filiere(filiere_id, filiere)
    if not updated:
        raise HTTPException(status_code=404, detail="Filière not found")
    return updated

@router.delete("/{filiere_id}", response_model=dict)
async def delete_filiere_endpoint(
    filiere_id: UUID,
    current_user: User = Depends(get_current_user)
):
    success = delete_existing_filiere(filiere_id)
    if not success:
        raise HTTPException(status_code=404, detail="Filière not found")
    return {"message": "Filière deleted successfully"}
