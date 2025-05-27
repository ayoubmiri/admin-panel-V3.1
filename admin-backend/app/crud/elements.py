from cassandra.cqlengine.query import DoesNotExist
from app.database.models import Element
from app.schemas.elements import ElementCreateSchema, ElementUpdateSchema
from fastapi import HTTPException, status

def create_element(data: ElementCreateSchema):
    existing = get_element_by_code(data.code)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Element with code '{data.code}' already exists."
        )
    try:
        return Element.create(**data.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating element: {e}")

def get_element_by_code(code: str):
    try:
        return Element.get(code=code)
    except DoesNotExist:
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving element: {e}")

def list_elements():
    try:
        return list(Element.objects().all())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing elements: {e}")

def update_element(code: str, data: ElementUpdateSchema):
    element = get_element_by_code(code)
    if not element:
        raise HTTPException(status_code=404, detail="Element not found.")
    try:
        for field, value in data.dict(exclude_unset=True).items():
            setattr(element, field, value)
        element.save()
        return element
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating element: {e}")

def delete_element(code: str):
    element = get_element_by_code(code)
    if not element:
        raise HTTPException(status_code=404, detail="Element not found.")
    try:
        element.delete()
        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting element: {e}")



# from cassandra.cqlengine.query import DoesNotExist
# from app.database.models import Element
# from app.schemas.elements import ElementCreateSchema, ElementUpdateSchema

# def create_element(data: ElementCreateSchema):
#     return Element.create(
#         module_id=data.module_id,
#         code=data.code,
#         name=data.name,
#         description=data.description
#     )

# def get_element_by_code(code: str):
#     try:
#         return Element.get(code=code)
#     except DoesNotExist:
#         return None

# def list_elements():
#     return Element.objects().all()

# def update_element(code: str, data: ElementUpdateSchema):
#     element = get_element_by_code(code)
#     if not element:
#         return None
#     if data.name:
#         element.name = data.name
#     if data.description is not None:
#         element.description = data.description
#     element.save()
#     return element

# def delete_element(code: str):
#     element = get_element_by_code(code)
#     if not element:
#         return None
#     element.delete()
#     return True
