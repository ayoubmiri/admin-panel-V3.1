from typing import List, Optional
from cassandra.cqlengine.query import DoesNotExist
from cassandra.cqlengine.management import sync_table
from fastapi import HTTPException, status
from app.database.models import Element
from app.schemas.elements import ElementCreateSchema, ElementUpdateSchema, ElementSchema

# Sync the Cassandra table schema (run once on startup)
# sync_table(Element)

# Helper function to convert Element model to dict
def element_to_dict(element: Element) -> dict:
    return {c: getattr(element, c) for c in element._defined_columns}

def create_element(data: ElementCreateSchema) -> ElementSchema:
    existing = get_element_by_code(data.code)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Element with code '{data.code}' already exists."
        )
    try:
        element_data = data.dict()
        new_element = Element.create(**element_data)
        return ElementSchema(**element_to_dict(new_element))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating element: {str(e)}")

def get_element_by_code(code: str) -> Optional[ElementSchema]:
    try:
        element = Element.objects(code=code).first()
        return ElementSchema(**element_to_dict(element)) if element else None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving element: {str(e)}")

def list_elements() -> List[ElementSchema]:
    try:
        elements = Element.objects().all()
        return [ElementSchema(**element_to_dict(e)) for e in elements]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing elements: {str(e)}")

def update_element(code: str, data: ElementUpdateSchema) -> Optional[ElementSchema]:
    element = get_element_by_code(code)
    if not element:
        raise HTTPException(status_code=404, detail="Element not found.")
    try:
        for field, value in data.dict(exclude_unset=True).items():
            setattr(element, field, value)
        element.save()
        return ElementSchema(**element_to_dict(element))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating element: {str(e)}")

def delete_element(code: str) -> bool:
    element = get_element_by_code(code)
    if not element:
        raise HTTPException(status_code=404, detail="Element not found.")
    try:
        element.delete()
        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting element: {str(e)}")




# from typing import List, Optional
# from cassandra.cqlengine.query import DoesNotExist
# from cassandra.cqlengine.management import sync_table
# from fastapi import HTTPException, status
# from app.database.models import Element
# from app.schemas.elements import ElementCreateSchema, ElementUpdateSchema, ElementInDB

# # Make sure the Cassandra table schema is synced (run once on startup)
# # sync_table(Element)

# # Helper function to convert Element model to dict
# def element_to_dict(element: Element) -> dict:
#     return {c: getattr(element, c) for c in element._defined_columns}

# def create_element(data: ElementCreateSchema) -> ElementInDB:
#     existing = get_element_by_code(data.code)
#     if existing:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=f"Element with code '{data.code}' already exists."
#         )
#     try:
#         element_data = data.dict()
#         new_element = Element.create(**element_data)
#         return ElementInDB(**element_to_dict(new_element))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error creating element: {str(e)}")

# def get_element_by_code(code: str) -> Optional[ElementInDB]:
#     try:
#         element = Element.objects(code=code).first()
#         return ElementInDB(**element_to_dict(element)) if element else None
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error retrieving element: {str(e)}")

# def list_elements() -> List[ElementInDB]:
#     try:
#         elements = Element.objects().all()
#         return [ElementInDB(**element_to_dict(e)) for e in elements]
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error listing elements: {str(e)}")

# def update_element(code: str, data: ElementUpdateSchema) -> Optional[ElementInDB]:
#     element = get_element_by_code(code)
#     if not element:
#         raise HTTPException(status_code=404, detail="Element not found.")
#     try:
#         for field, value in data.dict(exclude_unset=True).items():
#             setattr(element, field, value)
#         element.save()
#         return ElementInDB(**element_to_dict(element))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error updating element: {str(e)}")

# def delete_element(code: str) -> bool:
#     element = get_element_by_code(code)
#     if not element:
#         raise HTTPException(status_code=404, detail="Element not found.")
#     try:
#         element.delete()
#         return True
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error deleting element: {str(e)}")




# # from cassandra.cqlengine.query import DoesNotExist
# # from app.database.models import Element
# # from app.schemas.elements import ElementCreateSchema, ElementUpdateSchema
# # from fastapi import HTTPException, status

# # def create_element(data: ElementCreateSchema):
# #     existing = get_element_by_code(data.code)
# #     if existing:
# #         raise HTTPException(
# #             status_code=status.HTTP_400_BAD_REQUEST,
# #             detail=f"Element with code '{data.code}' already exists."
# #         )
# #     try:
# #         return Element.create(**data.dict())
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=f"Error creating element: {e}")

# # def get_element_by_code(code: str):
# #     try:
# #         return Element.get(code=code)
# #     except DoesNotExist:
# #         return None
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=f"Error retrieving element: {e}")

# # def list_elements():
# #     try:
# #         return list(Element.objects().all())
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=f"Error listing elements: {e}")

# # def update_element(code: str, data: ElementUpdateSchema):
# #     element = get_element_by_code(code)
# #     if not element:
# #         raise HTTPException(status_code=404, detail="Element not found.")
# #     try:
# #         for field, value in data.dict(exclude_unset=True).items():
# #             setattr(element, field, value)
# #         element.save()
# #         return element
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=f"Error updating element: {e}")

# # def delete_element(code: str):
# #     element = get_element_by_code(code)
# #     if not element:
# #         raise HTTPException(status_code=404, detail="Element not found.")
# #     try:
# #         element.delete()
# #         return True
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=f"Error deleting element: {e}")



# # # from cassandra.cqlengine.query import DoesNotExist
# # # from app.database.models import Element
# # # from app.schemas.elements import ElementCreateSchema, ElementUpdateSchema

# # # def create_element(data: ElementCreateSchema):
# # #     return Element.create(
# # #         module_id=data.module_id,
# # #         code=data.code,
# # #         name=data.name,
# # #         description=data.description
# # #     )

# # # def get_element_by_code(code: str):
# # #     try:
# # #         return Element.get(code=code)
# # #     except DoesNotExist:
# # #         return None

# # # def list_elements():
# # #     return Element.objects().all()

# # # def update_element(code: str, data: ElementUpdateSchema):
# # #     element = get_element_by_code(code)
# # #     if not element:
# # #         return None
# # #     if data.name:
# # #         element.name = data.name
# # #     if data.description is not None:
# # #         element.description = data.description
# # #     element.save()
# # #     return element

# # # def delete_element(code: str):
# # #     element = get_element_by_code(code)
# # #     if not element:
# # #         return None
# # #     element.delete()
# # #     return True
