from cassandra.cqlengine.query import DoesNotExist
from app.database.models import Element
from app.schemas.elements import ElementCreateSchema, ElementUpdateSchema

def create_element(data: ElementCreateSchema):
    return Element.create(
        module_id=data.module_id,
        code=data.code,
        name=data.name,
        description=data.description
    )

def get_element_by_code(code: str):
    try:
        return Element.get(code=code)
    except DoesNotExist:
        return None

def list_elements():
    return Element.objects().all()

def update_element(code: str, data: ElementUpdateSchema):
    element = get_element_by_code(code)
    if not element:
        return None
    if data.name:
        element.name = data.name
    if data.description is not None:
        element.description = data.description
    element.save()
    return element

def delete_element(code: str):
    element = get_element_by_code(code)
    if not element:
        return None
    element.delete()
    return True
