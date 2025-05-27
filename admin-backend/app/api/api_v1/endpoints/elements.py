from fastapi import APIRouter, HTTPException
from app.schemas.elements import ElementSchema, ElementCreateSchema, ElementUpdateSchema
from app.services import elements as service
from typing import List

router = APIRouter(prefix="/elements", tags=["Elements"])

@router.post("/", response_model=ElementSchema)
def create_element(data: ElementCreateSchema):
    return service.create_element_service(data)

@router.get("/{code}", response_model=ElementSchema)
def get_element(code: str):
    element = service.get_element_service(code)
    if not element:
        raise HTTPException(status_code=404, detail="Element not found")
    return element

@router.get("/", response_model=List[ElementSchema])
def list_elements():
    return service.list_elements_service()

@router.put("/{code}", response_model=ElementSchema)
def update_element(code: str, data: ElementUpdateSchema):
    updated = service.update_element_service(code, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Element not found")
    return updated

@router.delete("/{code}")
def delete_element(code: str):
    deleted = service.delete_element_service(code)
    if not deleted:
        raise HTTPException(status_code=404, detail="Element not found")
    return {"success": True}
