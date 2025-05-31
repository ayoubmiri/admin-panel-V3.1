# import logging
# from typing import Optional, Dict
# from uuid import uuid4, UUID
# from fastapi import HTTPException
# from cassandra.cqlengine.query import DoesNotExist
# from cassandra.util import Date as CassandraDate
# from datetime import date
# from app.database.models import Module
# from app.schemas.modules import ModuleCreate, ModuleUpdate, ModuleInDB

# # Configure logging
# logging.basicConfig(level=logging.DEBUG, filename='app.log', filemode='a', format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# def module_to_dict(module: Module) -> dict:
#     data = {c: getattr(module, c) for c in module._defined_columns}
#     # Handle date fields
#     date_fields = ['valid_from', 'valid_to', 'created_at', 'updated_at']
#     for field in date_fields:
#         if data.get(field):
#             if isinstance(data[field], CassandraDate):
#                 try:
#                     data[field] = data[field].date()
#                 except (ValueError, TypeError) as e:
#                     logger.error(f"Invalid date for {field} in module {data.get('code', 'unknown')} (id: {data.get('id', 'unknown')}): {data[field]}, error: {e}")
#                     data[field] = None
#             elif not isinstance(data[field], (date, type(None))):
#                 logger.warning(f"Unexpected type for {field} in module {data.get('code', 'unknown')} (id: {data.get('id', 'unknown')}): {type(data[field])}")
#                 data[field] = None
#     # Validate UUID fields
#     if data.get('filiere_id') and not isinstance(data['filiere_id'], UUID):
#         logger.error(f"Invalid filiere_id in module {data.get('code', 'unknown')} (id: {data.get('id', 'unknown')}): {data['filiere_id']}")
#         raise ValueError(f"Invalid filiere_id: {data['filiere_id']}")
#     logger.debug(f"Converted module to dict: {data}")
#     return data

# def create_module(data: ModuleCreate) -> ModuleInDB:
#     try:
#         module_data = data.dict(exclude_unset=True)
#         module_data['id'] = uuid4()
#         logger.debug(f"Creating module with data: {module_data}")
#         new_module = Module.create(**module_data)
#         result = ModuleInDB(**module_to_dict(new_module))
#         logger.debug(f"Created module: {result}")
#         return result
#     except Exception as e:
#         logger.exception(f"Error creating module: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error creating module: {str(e)}")

# def get_module(id: UUID) -> Optional[ModuleInDB]:
#     try:
#         module = Module.objects(id=id).first()
#         return ModuleInDB(**module_to_dict(module)) if module else None
#     except Exception as e:
#         logger.exception(f"Error retrieving module: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error retrieving module: {str(e)}")

# def get_all_modules(filiere_id: Optional[UUID] = None, skip: int = 0, limit: int = 100) -> Dict:
#     try:
#         logger.debug(f"Fetching modules with filiere_id={filiere_id}, skip={skip}, limit={limit}")
#         if filiere_id:
#             modules = Module.objects(filiere_id=filiere_id)
#         else:
#             modules = Module.objects.all()
#         total = modules.count()
#         modules_list = []
#         for module in modules[skip:skip + limit]:
#             try:
#                 module_dict = module_to_dict(module)
#                 modules_list.append(ModuleInDB(**module_dict))
#             except Exception as e:
#                 logger.error(f"Error processing module {module.id}: {str(e)}")
#                 continue  # Skip invalid modules
#         result = {
#             "modules": modules_list,
#             "total": total
#         }
#         logger.debug(f"Retrieved modules: {len(modules_list)} of {total}")
#         return result
#     except Exception as e:
#         logger.exception(f"Error retrieving all modules: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error retrieving all modules: {str(e)}")

# def update_module(id: UUID, data: ModuleUpdate) -> Optional[ModuleInDB]:
#     try:
#         module = Module.objects(id=id).first()
#         if not module:
#             return None
#         update_data = data.dict(exclude_unset=True)
#         logger.debug(f"Updating module {id} with data: {update_data}")
#         for field, value in update_data.items():
#             setattr(module, field, value)
#         module.save()
#         return ModuleInDB(**module_to_dict(module))
#     except Exception as e:
#         logger.exception(f"Error updating module: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error updating module: {str(e)}")

# def delete_module(id: UUID) -> bool:
#     try:
#         module = Module.objects(id=id).first()
#         if not module:
#             return False
#         module.delete()
#         logger.debug(f"Deleted module {id}")
#         return True
#     except Exception as e:
#         logger.exception(f"Error deleting module: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error deleting module: {str(e)}")






import logging
from typing import Optional, Dict
from uuid import uuid4, UUID
from fastapi import HTTPException
from cassandra.cqlengine.query import DoesNotExist
from cassandra.util import Date as CassandraDate
from datetime import date
from app.database.models import Module, Filiere
from app.schemas.modules import ModuleCreate, ModuleUpdate, ModuleInDB

# Configure logging
logging.basicConfig(level=logging.DEBUG, filename='app.log', filemode='a', format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def module_to_dict(module: Module) -> dict:
    try:
        data = {c: getattr(module, c) for c in module._defined_columns}
        # Handle date fields
        date_fields = ['valid_from', 'valid_to', 'created_at', 'updated_at']
        for field in date_fields:
            if data.get(field):
                if isinstance(data[field], CassandraDate):
                    try:
                        data[field] = data[field].date()
                    except (ValueError, TypeError) as e:
                        logger.error(f"Invalid date for {field} in module {data.get('code', 'unknown')} (id: {data.get('id', 'unknown')}): {data[field]}, error: {e}")
                        data[field] = None
                elif not isinstance(data[field], (date, type(None))):
                    logger.warning(f"Unexpected type for {field} in module {data.get('code', 'unknown')} (id: {data.get('id', 'unknown')}): {type(data[field])}")
                    data[field] = None
        # Validate UUID fields
        for field in ['id', 'filiere_id']:
            if data.get(field) and not isinstance(data[field], UUID):
                logger.error(f"Invalid {field} in module {data.get('code', 'unknown')} (id: {data.get('id', 'unknown')}): {data[field]}")
                raise ValueError(f"Invalid {field}: {data[field]}")
        logger.debug(f"Converted module to dict: {data}")
        return data
    except Exception as e:
        logger.exception(f"Error converting module to dict: {str(e)}")
        raise

def create_module(data: ModuleCreate) -> ModuleInDB:
    try:
        # Validate filiere_id
        if not Filiere.objects(id=data.filiere_id).first():
            raise HTTPException(status_code=400, detail="Invalid filiere_id")
        module_data = data.dict(exclude_unset=True)
        module_data['id'] = uuid4()
        logger.debug(f"Creating module with data: {module_data}")
        new_module = Module.create(**module_data)
        result = ModuleInDB(**module_to_dict(new_module))
        logger.debug(f"Created module: {result}")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error creating module: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating module: {str(e)}")

def get_module(id: UUID) -> Optional[ModuleInDB]:
    try:
        module = Module.objects(id=id).first()
        return ModuleInDB(**module_to_dict(module)) if module else None
    except Exception as e:
        logger.exception(f"Error retrieving module: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving module: {str(e)}")

def get_all_modules(filiere_id: Optional[UUID] = None, skip: int = 0, limit: int = 100) -> Dict:
    try:
        logger.debug(f"Fetching modules with filiere_id={filiere_id}, skip={skip}, limit={limit}")
        # Validate filiere_id if provided
        if filiere_id and not Filiere.objects(id=filiere_id).first():
            raise HTTPException(status_code=400, detail="Invalid filiere_id")
        if filiere_id:
            modules = Module.objects(filiere_id=filiere_id).allow_filtering()
        else:
            modules = Module.objects.all()
        total = modules.count()
        modules_list = []
        for module in modules[skip:skip + limit]:
            try:
                module_dict = module_to_dict(module)
                modules_list.append(ModuleInDB(**module_dict))
            except Exception as e:
                logger.error(f"Error processing module {getattr(module, 'id', 'unknown')}: {str(e)}")
                continue  # Skip invalid modules
        result = {
            "modules": modules_list,
            "total": total
        }
        logger.debug(f"Retrieved {len(modules_list)} of {total} modules")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error retrieving all modules: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving all modules: {str(e)}")

def update_module(id: UUID, data: ModuleUpdate) -> Optional[ModuleInDB]:
    try:
        module = Module.objects(id=id).first()
        if not module:
            return None
        # Validate filiere_id if provided
        if data.filiere_id and not Filiere.objects(id=data.filiere_id).first():
            raise HTTPException(status_code=400, detail="Invalid filiere_id")
        update_data = data.dict(exclude_unset=True)
        logger.debug(f"Updating module {id} with data: {update_data}")
        for field, value in update_data.items():
            setattr(module, field, value)
        module.save()
        return ModuleInDB(**module_to_dict(module))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error updating module: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating module: {str(e)}")

def delete_module(id: UUID) -> bool:
    try:
        module = Module.objects(id=id).first()
        if not module:
            return False
        module.delete()
        logger.debug(f"Deleted module {id}")
        return True
    except Exception as e:
        logger.exception(f"Error deleting module: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting module: {str(e)}")