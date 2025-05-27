from app.crud.classes import (
    create_class, get_class, update_class,
    list_classes_by_filiere, delete_class
)
from app.schemas.classes import ClassCreateSchema, ClassUpdateSchema
from uuid import UUID

def create_class_service(data: ClassCreateSchema):
    return create_class(data)

def get_class_service(filiere_id: UUID, code: str):
    return get_class(filiere_id, code)

def update_class_service(filiere_id: UUID, code: str, data: ClassUpdateSchema):
    return update_class(filiere_id, code, data)

def list_classes_service(filiere_id: UUID):
    return list_classes_by_filiere(filiere_id)

def delete_class_service(filiere_id: UUID, code: str):
    return delete_class(filiere_id, code)
