# from typing import List, Optional
# from uuid import UUID
# from app.schemas.modules import ModuleCreate, ModuleUpdate, ModuleInDB
# from app.crud.modules import (
#     get_module,
#     get_all_modules,
#     create_module,
#     update_module,
#     delete_module,
# )

# def get_all_modules(skip: int = 0, limit: int = 100) -> List[ModuleInDB]:
#     return get_all_modules(skip=skip, limit=limit)

# def get_single_module(module_id: UUID) -> Optional[ModuleInDB]:
#     return get_module(module_id)

# def create_new_module(module: ModuleCreate) -> ModuleInDB:
#     return create_module(module)

# def update_existing_module(module_id: UUID, module: ModuleUpdate) -> Optional[ModuleInDB]:
#     return update_module(module_id, module)

# def delete_existing_module(module_id: UUID) -> bool:
#     return delete_module(module_id)









from typing import List, Optional
from uuid import UUID
from app.schemas.modules import ModuleCreate, ModuleUpdate, ModuleInDB
from app.crud.modules import (
    get_module,
    get_all_modules,
    create_module,
    update_module,
    delete_module,
)

def get_all_modules_service(filiere_id: Optional[UUID] = None, skip: int = 0, limit: int = 100) -> List[ModuleInDB]:
    """
    Retrieve all modules with pagination and optional filiere filter.

    Args:
        filiere_id (Optional[UUID]): Filter by filiere ID (optional).
        skip (int): Number of records to skip (default: 0).
        limit (int): Maximum number of records to return (default: 100).

    Returns:
        List[ModuleInDB]: List of modules.
    """
    result = get_all_modules(filiere_id=filiere_id, skip=skip, limit=limit)
    return result["modules"]

def get_single_module_service(module_id: UUID) -> Optional[ModuleInDB]:
    """
    Retrieve a single module by ID.

    Args:
        module_id (UUID): The ID of the module.

    Returns:
        Optional[ModuleInDB]: The module if found, else None.
    """
    return get_module(module_id)

def create_new_module_service(module: ModuleCreate) -> ModuleInDB:
    """
    Create a new module.

    Args:
        module (ModuleCreate): The module data to create.

    Returns:
        ModuleInDB: The created module.
    """
    return create_module(module)

def update_existing_module_service(module_id: UUID, module: ModuleUpdate) -> Optional[ModuleInDB]:
    """
    Update an existing module.

    Args:
        module_id (UUID): The ID of the module.
        module (ModuleUpdate): The updated module data.

    Returns:
        Optional[ModuleInDB]: The updated module if found, else None.
    """
    return update_module(module_id, module)

def delete_existing_module_service(module_id: UUID) -> bool:
    """
    Delete a module by ID.

    Args:
        module_id (UUID): The ID of the module.

    Returns:
        bool: True if deleted, False if not found.
    """
    return delete_module(module_id)