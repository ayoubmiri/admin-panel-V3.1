from app.schemas.elements import ElementCreateSchema, ElementUpdateSchema
from app.crud import elements as crud
from typing import List

def create_element_service(data: ElementCreateSchema):
    return crud.create_element(data)

def get_element_service(code: str):
    return crud.get_element_by_code(code)

def list_elements_service():
    return crud.list_elements()

def update_element_service(code: str, data: ElementUpdateSchema):
    return crud.update_element(code, data)

def delete_element_service(code: str):
    return crud.delete_element(code)
