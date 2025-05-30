from typing import List, Optional, Dict
from uuid import UUID
from app.schemas.classes import ClassCreateSchema, ClassUpdateSchema, ClassSchema
from app.crud.classes import (
  create_class,
  get_class,
  get_all_classes,
  update_class,
  delete_class,
  list_classes_by_filiere
)

def create_class_service(data: ClassCreateSchema) -> ClassSchema:
    """
    Service to create a new class.
    
    Args:
        data (ClassCreateSchema): The class data to create.
    
    Returns:
        ClassSchema: The created class.
    """
    return create_class(data)

def get_class_service(filiere_id: UUID, code: str) -> Optional[ClassSchema]:
    """
    Service to retrieve a class by filiere_id and code.
    
    Args:
        filiere_id (UUID): The ID of the filiere.
        code (str): The class code.
    
    Returns:
        Optional[ClassSchema]: The class if found, else None.
    """
    return get_class(filiere_id, code)

def get_all_classes_service(skip: int = 0, limit: int = 100, search: str = '') -> Dict:
    """
    Service to retrieve all classes with pagination and optional search.
    
    Args:
        skip (int): Number of records to skip (default: 0).
        limit (int): Maximum number of records to return (default: 100).
        search (str): Optional search term to filter classes by name (default: '').
    
    Returns:
        Dict: A dictionary containing the list of classes and total count.
              Format: {"classes": List[ClassSchema], "total": int}
    """
    return get_all_classes(skip=skip, limit=limit, search=search)

def list_classes_service(filiere_id: UUID, skip: int = 0, limit: int = 100, search: str = '') -> Dict:
    """
    Service to retrieve classes by filiere with pagination and optional search.
    
    Args:
        filiere_id (UUID): The ID of the filiere.
        skip (int): Number of records to skip (default: 0).
        limit (int): Maximum number of records to return (default: 100).
        search (str): Optional search term to filter classes by name (default: '').
    
    Returns:
        Dict: A dictionary containing the list of classes and total count.
              Format: {"classes": List[ClassSchema], "total": int}
    """
    return list_classes_by_filiere(filiere_id, skip=skip, limit=limit, search=search)

def update_class_service(filiere_id: UUID, code: str, data: ClassUpdateSchema) -> Optional[ClassSchema]:
    """
    Service to update a class by filiere_id and code.
    
    Args:
        filiere_id (UUID): The ID of the filiere.
        code (str): The class code.
        data (ClassUpdateSchema): The updated class data.
    
    Returns:
        Optional[ClassSchema]: The updated class if found, else None.
    """
    return update_class(filiere_id, code, data)

def delete_class_service(filiere_id: UUID, code: str) -> bool:
    """
    Service to delete a class by filiere_id and code.
    
    Args:
        filiere_id (UUID): The ID of the filiere.
        code (str): The class code.
    
    Returns:
        bool: True if the class was deleted, False if not found.
    """
    return delete_class(filiere_id, code)













# from typing import List, Optional
# from uuid import UUID
# from app.schemas.classes import ClassCreateSchema, ClassUpdateSchema, ClassSchema
# from app.crud.classes import (
#     create_class as crud_create_class,
#     get_class as crud_get_class,
#     get_all_classes as crud_get_all_classes,
#     list_classes_by_filiere as crud_list_classes_by_filiere,
#     update_class as crud_update_class,
#     delete_class as crud_delete_class,
# )

# def create_class(data: ClassCreateSchema) -> ClassSchema:
#     return crud_create_class(data)

# def get_class(filiere_id: UUID, code: str) -> Optional[ClassSchema]:
#     return crud_get_class(filiere_id, code)

# def get_all_classes(skip: int = 0, limit: int = 100) -> List[ClassSchema]:
#     return crud_get_all_classes(skip=skip, limit=limit)

# def list_classes_by_filiere(filiere_id: UUID, skip: int = 0, limit: int = 100) -> List[ClassSchema]:
#     return crud_list_classes_by_filiere(filiere_id, skip=skip, limit=limit)

# def update_class(filiere_id: UUID, code: str, data: ClassUpdateSchema) -> Optional[ClassSchema]:
#     return crud_update_class(filiere_id, code, data)

# def delete_class(filiere_id: UUID, code: str) -> bool:
#     return crud_delete_class(filiere_id, code)



# # from app.crud.classes import (
# #     create_class, get_class, update_class,
# #     list_classes_by_filiere, delete_class
# # )
# # from app.schemas.classes import ClassCreateSchema, ClassUpdateSchema
# # from uuid import UUID

# # def create_class_service(data: ClassCreateSchema):
# #     return create_class(data)

# # def get_class_service(filiere_id: UUID, code: str):
# #     return get_class(filiere_id, code)

# # def update_class_service(filiere_id: UUID, code: str, data: ClassUpdateSchema):
# #     return update_class(filiere_id, code, data)

# # def list_classes_service(filiere_id: UUID):
# #     return list_classes_by_filiere(filiere_id)

# # def delete_class_service(filiere_id: UUID, code: str):
# #     return delete_class(filiere_id, code)
