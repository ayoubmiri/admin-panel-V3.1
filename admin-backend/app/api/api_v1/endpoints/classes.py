from fastapi import APIRouter, HTTPException
from typing import List
from uuid import UUID

from app.schemas.classes import (
    ClassCreateSchema, ClassSchema,
    ClassUpdateSchema
)
from app.services import classes as service

router = APIRouter(prefix="/classes", tags=["Classes"])

@router.post("/", response_model=ClassSchema)
def create_class_endpoint(data: ClassCreateSchema):
    return service.create_class_service(data)

@router.get("/{filiere_id}/{code}", response_model=ClassSchema)
def get_class_endpoint(filiere_id: UUID, code: str):
    result = service.get_class_service(filiere_id, code)
    if not result:
        raise HTTPException(status_code=404, detail="Class not found")
    return result

@router.get("/filiere/{filiere_id}", response_model=List[ClassSchema])
def list_classes_endpoint(filiere_id: UUID):
    return service.list_classes_service(filiere_id)

@router.put("/{filiere_id}/{code}", response_model=ClassSchema)
def update_class_endpoint(filiere_id: UUID, code: str, data: ClassUpdateSchema):
    result = service.update_class_service(filiere_id, code, data)
    if not result:
        raise HTTPException(status_code=404, detail="Class not found")
    return result

@router.delete("/{filiere_id}/{code}")
def delete_class_endpoint(filiere_id: UUID, code: str):
    result = service.delete_class_service(filiere_id, code)
    if not result:
        raise HTTPException(status_code=404, detail="Class not found")
    return {"success": True}
