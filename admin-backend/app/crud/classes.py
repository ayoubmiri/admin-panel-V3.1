

# # import logging
# # from typing import List, Optional, Dict
# # from uuid import UUID
# # from fastapi import HTTPException
# # from cassandra.cqlengine.management import sync_table
# # from cassandra.cqlengine.query import DoesNotExist
# # from app.database.models import Class
# # from app.schemas.classes import ClassCreateSchema, ClassUpdateSchema, ClassSchema

# # # Configure logging
# # logging.basicConfig(level=logging.DEBUG, filename='app.log', filemode='a', format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
# # logger = logging.getLogger(__name__)

# # def class_to_dict(class_instance: Class) -> dict:
# #     data = {c: getattr(class_instance, c) for c in class_instance._defined_columns}
# #     date_fields = ['created_at', 'updated_at']
# #     for field in date_fields:
# #         if field in data and data[field]:
# #             try:
# #                 data[field] = data[field]
# #             except (ValueError, TypeError) as e:
# #                 logger.error(f"Invalid date for {field} in class {data.get('code')} (filiere_id: {data.get('filiere_id')}): {data[field]}, error: {e}")
# #                 data[field] = None
# #     # Handle null or invalid name
# #     if 'name' not in data or data['name'] is None or not isinstance(data['name'], str):
# #         data['name'] = f"Class {data.get('code', 'Unknown')}"
# #     logger.debug(f"Converted class to dict: {data}")
# #     return data

# # def create_class(data: ClassCreateSchema) -> ClassSchema:

# #     try:
# #         class_data = data.dict()
# #         if not class_data.get('name') or not isinstance(class_data['name'], str):
# #             class_data['name'] = f"Class {class_data['code']}"
# #         logger.debug(f"Creating class with data: {class_data}")
# #         new_class = Class.create(**class_data)
# #         return ClassSchema(**class_to_dict(new_class))
# #     except Exception as e:
# #         logger.exception(f"Error creating class: {str(e)}")
# #         raise HTTPException(status_code=500, detail=f"Error creating class: {str(e)}")

# # def get_class(filiere_id: UUID, code: str) -> Optional[ClassSchema]:
# #     try:
# #         class_instance = Class.objects(filiere_id=filiere_id, code=code).first()
# #         return ClassSchema(**class_to_dict(class_instance)) if class_instance else None
# #     except Exception as e:
# #         logger.exception(f"Error retrieving class: {str(e)}")
# #         raise HTTPException(status_code=500, detail=f"Error retrieving class: {str(e)}")

# # def get_all_classes(skip: int = 0, limit: int = 100, search: str = '') -> Dict:
# #     try:
# #         logger.debug(f"Fetching classes with skip={skip}, limit={limit}, search={search}")
# #         classes = Class.objects.all()
# #         total = classes.count()
# #         classes_list = list(classes)  # Fetch to memory
# #         if search:
# #             logger.debug(f"Applying in-memory search filter: name contains {search}")
# #             classes_list = [c for c in classes_list if search.lower() in (c.name or '').lower()]
# #             total = len(classes_list)
# #         classes_list = classes_list[skip:skip + limit]
# #         result = {
# #             "classes": [ClassSchema(**class_to_dict(c)) for c in classes_list],
# #             "total": total
# #         }
# #         logger.debug(f"Retrieved classes: {result}")
# #         return result
# #     except Exception as e:
# #         logger.exception(f"Error retrieving all classes: {str(e)}")
# #         raise HTTPException(status_code=500, detail=f"Error retrieving all classes: {str(e)}")

# # def list_classes_by_filiere(filiere_id: UUID, skip: int = 0, limit: int = 100, search: str = '') -> Dict:
# #     try:
# #         logger.debug(f"Fetching classes for filiere_id={filiere_id}, skip={skip}, limit={limit}, search={search}")
# #         classes = Class.objects(filiere_id=filiere_id)
# #         total = classes.count()
# #         classes_list = list(classes)
# #         if search:
# #             logger.debug(f"Applying in-memory search filter: name contains {search}")
# #             classes_list = [c for c in classes_list if search.lower() in (c.name or '').lower()]
# #             total = len(classes_list)
# #         classes_list = classes_list[skip:skip + limit]
# #         result = {
# #             "classes": [ClassSchema(**class_to_dict(c)) for c in classes_list],
# #             "total": total
# #         }
# #         logger.debug(f"Retrieved classes for filiere: {result}")
# #         return result
# #     except Exception as e:
# #         logger.exception(f"Error retrieving classes for filiere {filiere_id}: {str(e)}")
# #         raise HTTPException(status_code=500, detail=f"Error retrieving classes: {str(e)}")

# # def update_class(filiere_id: UUID, code: str, data: ClassUpdateSchema) -> Optional[ClassSchema]:
# #     try:
# #         existing = Class.objects(filiere_id=filiere_id, code=code).first()
# #         if not existing:
# #             return None
# #         update_data = data.dict(exclude_unset=True)
# #         logger.debug(f"Updating class (filiere_id: {filiere_id}, code: {code}) with data: {update_data}")
# #         for field, value in update_data.items():
# #             setattr(existing, field, value)
# #         existing.save()
# #         return ClassSchema(**class_to_dict(existing))
# #     except Exception as e:
# #         logger.exception(f"Error updating class: {str(e)}")
# #         raise HTTPException(status_code=500, detail=f"Error updating class: {str(e)}")

# # def delete_class(filiere_id: UUID, code: str) -> bool:
# #     try:
# #         existing = Class.objects(filiere_id=filiere_id, code=code).first()
# #         if not existing:
# #             return False
# #         existing.delete()
# #         logger.debug(f"Deleted class (filiere_id: {filiere_id}, code: {code})")
# #         return True
# #     except Exception as e:
# #         logger.exception(f"Error deleting class: {str(e)}")
# #         raise HTTPException(status_code=500, detail=f"Error deleting class: {str(e)}")





# import logging
# from typing import List, Optional, Dict
# from uuid import UUID
# from fastapi import HTTPException
# from cassandra.cqlengine.management import sync_table
# from cassandra.cqlengine.query import DoesNotExist
# from cassandra.util import Date as CassandraDate
# from datetime import date
# from app.database.models import Class
# from app.schemas.classes import ClassCreateSchema, ClassUpdateSchema, ClassSchema

# # Configure logging
# logging.basicConfig(level=logging.DEBUG, filename='app.log', filemode='a', format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# def class_to_dict(class_instance: Class) -> dict:
#     data = {c: getattr(class_instance, c) for c in class_instance._defined_columns}
#     # Handle date fields
#     date_fields = ['created_at', 'updated_at']  # Add other date fields if present
#     for field in date_fields:
#         if data.get(field):
#             if isinstance(data[field], CassandraDate):
#                 try:
#                     data[field] = data[field].date()
#                 except (ValueError, TypeError) as e:
#                     logger.error(f"Invalid date for {field} in class {data.get('code')} (filiere_id: {data.get('filiere_id')}): {data[field]}, error: {e}")
#                     data[field] = None
#     # Handle null or invalid name
#     if 'name' not in data or data['name'] is None or not isinstance(data['name'], str):
#         data['name'] = f"Class {data.get('code', 'Unknown')}"
#     logger.debug(f"Converted class to dict: {data}")
#     return data

# def create_class(data: ClassCreateSchema) -> ClassSchema:
#     try:
#         class_data = data.dict()
#         if not class_data.get('name') or not isinstance(class_data['name'], str):
#             class_data['name'] = f"Class {class_data['code']}"
#         logger.debug(f"Creating class with data: {class_data}")
#         new_class = Class.create(**class_data)
#         return ClassSchema(**class_to_dict(new_class))
#     except Exception as e:
#         logger.exception(f"Error creating class: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error creating class: {str(e)}")

# def get_class(filiere_id: UUID, code: str) -> Optional[ClassSchema]:
#     try:
#         class_instance = Class.objects(filiere_id=filiere_id, code=code).first()
#         return ClassSchema(**class_to_dict(class_instance)) if class_instance else None
#     except Exception as e:
#         logger.exception(f"Error retrieving class: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error retrieving class: {str(e)}")

# def get_all_classes(skip: int = 0, limit: int = 100, search: str = '') -> Dict:
#     try:
#         logger.debug(f"Fetching classes with skip={skip}, limit={limit}, search={search}")
#         classes = Class.objects.all()
#         total = classes.count()
#         classes_list = list(classes)
#         if search:
#             logger.debug(f"Applying in-memory search filter: name contains {search}")
#             classes_list = [c for c in classes_list if search.lower() in (c.name or '').lower()]
#             total = len(classes_list)
#         classes_list = classes_list[skip:skip + limit]
#         result = {
#             "classes": [ClassSchema(**class_to_dict(c)) for c in classes_list],
#             "total": total
#         }
#         logger.debug(f"Retrieved classes: {result}")
#         return result
#     except Exception as e:
#         logger.exception(f"Error retrieving all classes: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error retrieving all classes: {str(e)}")

# def list_classes_by_filiere(filiere_id: UUID, skip: int = 0, limit: int = 100, search: str = '') -> Dict:
#     try:
#         logger.debug(f"Fetching classes for filiere_id={filiere_id}, skip={skip}, limit={limit}, search={search}")
#         classes = Class.objects(filiere_id=filiere_id)
#         total = classes.count()
#         classes_list = list(classes)
#         if search:
#             logger.debug(f"Applying in-memory search filter: name contains {search}")
#             classes_list = [c for c in classes_list if search.lower() in (c.name or '').lower()]
#             total = len(classes_list)
#         classes_list = classes_list[skip:skip + limit]
#         result = {
#             "classes": [ClassSchema(**class_to_dict(c)) for c in classes_list],
#             "total": total
#         }
#         logger.debug(f"Retrieved classes for filiere: {result}")
#         return result
#     except Exception as e:
#         logger.exception(f"Error retrieving classes for filiere {filiere_id}: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error retrieving classes: {str(e)}")

# def update_class(filiere_id: UUID, code: str, data: ClassUpdateSchema) -> Optional[ClassSchema]:
#     try:
#         existing = Class.objects(filiere_id=filiere_id, code=code).first()
#         if not existing:
#             return None
#         update_data = data.dict(exclude_unset=True)
#         logger.debug(f"Updating class (filiere_id: {filiere_id}, code: {code}) with data: {update_data}")
#         for field, value in update_data.items():
#             setattr(existing, field, value)
#         existing.save()
#         return ClassSchema(**class_to_dict(existing))
#     except Exception as e:
#         logger.exception(f"Error updating class: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error updating class: {str(e)}")

# def delete_class(filiere_id: UUID, code: str) -> bool:
#     try:
#         existing = Class.objects(filiere_id=filiere_id, code=code).first()
#         if not existing:
#             return False
#         existing.delete()
#         logger.debug(f"Deleted class (filiere_id: {filiere_id}, code: {code})")
#         return True
#     except Exception as e:
#         logger.exception(f"Error deleting class: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error deleting class: {str(e)}")










# import logging
# from typing import List, Optional, Dict
# from uuid import UUID
# from fastapi import HTTPException
# from cassandra.cqlengine.management import sync_table
# from cassandra.cqlengine.query import DoesNotExist
# from cassandra.util import Date as CassandraDate
# from datetime import date
# from app.database.models import Class
# from app.schemas.classes import ClassCreateSchema, ClassUpdateSchema, ClassSchema

# # Configure logging
# logging.basicConfig(level=logging.DEBUG, filename='app.log', filemode='a', format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# def class_to_dict(class_instance: Class) -> dict:
#     data = {c: getattr(class_instance, c) for c in class_instance._defined_columns}
#     # Handle date fields
#     date_fields = ['created_at', 'updated_at']  # Add other date fields if present
#     for field in date_fields:
#         if data.get(field):
#             if isinstance(data[field], CassandraDate):
#                 try:
#                     data[field] = data[field].date()
#                 except (ValueError, TypeError) as e:
#                     logger.error(f"Invalid date for {field} in class {data.get('code')} (filiere_id: {data.get('filiere_id')}): {data[field]}, error: {e}")
#                     data[field] = None
#     # Handle null or invalid name
#     if 'name' not in data or data['name'] is None or not isinstance(data['name'], str):
#         data['name'] = f"Class {data.get('code', 'Unknown')}"
#     logger.debug(f"Converted class to dict: {data}")
#     return data

# def create_class(data: ClassCreateSchema) -> ClassSchema:
#     try:
#         class_data = data.dict()
#         if not class_data.get('name') or not isinstance(class_data['name'], str):
#             class_data['name'] = f"Class {class_data['code']}"
#         logger.debug(f"Creating class with data: {class_data}")
#         new_class = Class.create(**class_data)
#         return ClassSchema(**class_to_dict(new_class))
#     except Exception as e:
#         logger.exception(f"Error creating class: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error creating class: {str(e)}")

# def get_class(filiere_id: UUID, code: str) -> Optional[ClassSchema]:
#     try:
#         class_instance = Class.objects(filiere_id=filiere_id, code=code).first()
#         return ClassSchema(**class_to_dict(class_instance)) if class_instance else None
#     except Exception as e:
#         logger.exception(f"Error retrieving class: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error retrieving class: {str(e)}")

# def get_all_classes(skip: int = 0, limit: int = 100, search: str = '') -> Dict:
#     try:
#         logger.debug(f"Fetching classes with skip={skip}, limit={limit}, search={search}")
#         classes = Class.objects.all()
#         total = classes.count()
#         classes_list = list(classes)
#         if search:
#             logger.debug(f"Applying in-memory search filter: name contains {search}")
#             classes_list = [c for c in classes_list if search.lower() in (c.name or '').lower()]
#             total = len(classes_list)
#         classes_list = classes_list[skip:skip + limit]
#         result = {
#             "classes": [ClassSchema(**class_to_dict(c)) for c in classes_list],
#             "total": total
#         }
#         logger.debug(f"Retrieved classes: {result}")
#         return result
#     except Exception as e:
#         logger.exception(f"Error retrieving all classes: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error retrieving all classes: {str(e)}")

# def list_classes_by_filiere(filiere_id: UUID, skip: int = 0, limit: int = 100, search: str = '') -> Dict:
#     try:
#         logger.debug(f"Fetching classes for filiere_id={filiere_id}, skip={skip}, limit={limit}, search={search}")
#         classes = Class.objects(filiere_id=filiere_id)
#         total = classes.count()
#         classes_list = list(classes)
#         if search:
#             logger.debug(f"Applying in-memory search filter: name contains {search}")
#             classes_list = [c for c in classes_list if search.lower() in (c.name or '').lower()]
#             total = len(classes_list)
#         classes_list = classes_list[skip:skip + limit]
#         result = {
#             "classes": [ClassSchema(**class_to_dict(c)) for c in classes_list],
#             "total": total
#         }
#         logger.debug(f"Retrieved classes for filiere: {result}")
#         return result
#     except Exception as e:
#         logger.exception(f"Error retrieving classes for filiere {filiere_id}: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error retrieving classes: {str(e)}")

# def update_class(filiere_id: UUID, code: str, data: ClassUpdateSchema) -> Optional[ClassSchema]:
#     try:
#         existing = Class.objects(filiere_id=filiere_id, code=code).first()
#         if not existing:
#             return None
#         update_data = data.dict(exclude_unset=True)
#         logger.debug(f"Updating class (filiere_id: {filiere_id}, code: {code}) with data: {update_data}")
#         for field, value in update_data.items():
#             setattr(existing, field, value)
#         existing.save()
#         return ClassSchema(**class_to_dict(existing))
#     except Exception as e:
#         logger.exception(f"Error updating class: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error updating class: {str(e)}")

# def delete_class(filiere_id: UUID, code: str) -> bool:
#     try:
#         existing = Class.objects(filiere_id=filiere_id, code=code).first()
#         if not existing:
#             return False
#         existing.delete()
#         logger.debug(f"Deleted class (filiere_id: {filiere_id}, code: {code})")
#         return True
#     except Exception as e:
#         logger.exception(f"Error deleting class: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error deleting class: {str(e)}")



import logging
from typing import List, Optional, Dict
from uuid import uuid4, UUID
from fastapi import HTTPException
from cassandra.cqlengine.management import sync_table
from cassandra.cqlengine.query import DoesNotExist
from cassandra.util import Date as CassandraDate
from datetime import date
from app.database.models import Class
from app.schemas.classes import ClassCreateSchema, ClassUpdateSchema, ClassSchema

# Configure logging
logging.basicConfig(level=logging.DEBUG, filename='app.log', filemode='a', format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def class_to_dict(class_instance: Class) -> dict:
    data = {c: getattr(class_instance, c) for c in class_instance._defined_columns}
    # Handle date fields
    date_fields = ['created_at', 'updated_at']
    for field in date_fields:
        if data.get(field):
            if isinstance(data[field], CassandraDate):
                try:
                    data[field] = data[field].date()
                except (ValueError, TypeError) as e:
                    logger.error(f"Invalid date for {field} in class {data.get('code')} (filiere_id: {data.get('filiere_id')}): {data[field]}, error: {e}")
                    data[field] = None
    # Ensure id is included
    if 'id' not in data or data['id'] is None:
        logger.error(f"Missing id for class {data.get('code')} (filiere_id: {data.get('filiere_id')})")
        raise ValueError("Class id is missing or null")
    # Handle null or invalid name
    if 'name' not in data or data['name'] is None or not isinstance(data['name'], str):
        data['name'] = f"Class {data.get('code', 'Unknown')}"
    logger.debug(f"Converted class to dict: {data}")
    return data

def create_class(data: ClassCreateSchema) -> ClassSchema:
    try:
        class_data = data.dict()
        # Generate UUID4 for id
        class_data['id'] = uuid4()
        if not class_data.get('name') or not isinstance(class_data['name'], str):
            class_data['name'] = f"Class {class_data['code']}"
        logger.debug(f"Creating class with data: {class_data}")
        new_class = Class.create(**class_data)
        result = ClassSchema(**class_to_dict(new_class))
        logger.debug(f"Created class: {result}")
        return result
    except Exception as e:
        logger.exception(f"Error creating class: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating class: {str(e)}")

def get_class(filiere_id: UUID, code: str) -> Optional[ClassSchema]:
    try:
        class_instance = Class.objects(filiere_id=filiere_id, code=code).first()
        return ClassSchema(**class_to_dict(class_instance)) if class_instance else None
    except Exception as e:
        logger.exception(f"Error retrieving class: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving class: {str(e)}")

def get_all_classes(skip: int = 0, limit: int = 100, search: str = '') -> Dict:
    try:
        logger.debug(f"Fetching classes with skip={skip}, limit={limit}, search={search}")
        classes = Class.objects.all()
        total = classes.count()
        classes_list = list(classes)
        if search:
            logger.debug(f"Applying in-memory search filter: name contains {search}")
            classes_list = [c for c in classes_list if search.lower() in (c.name or '').lower()]
            total = len(classes_list)
        classes_list = classes_list[skip:skip + limit]
        result = {
            "classes": [ClassSchema(**class_to_dict(c)) for c in classes_list],
            "total": total
        }
        logger.debug(f"Retrieved classes: {result}")
        return result
    except Exception as e:
        logger.exception(f"Error retrieving all classes: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving all classes: {str(e)}")

def list_classes_by_filiere(filiere_id: UUID, skip: int = 0, limit: int = 100, search: str = '') -> Dict:
    try:
        logger.debug(f"Fetching classes for filiere_id={filiere_id}, skip={skip}, limit={limit}, search={search}")
        classes = Class.objects(filiere_id=filiere_id)
        total = classes.count()
        classes_list = list(classes)
        if search:
            logger.debug(f"Applying in-memory search filter: name contains {search}")
            classes_list = [c for c in classes_list if search.lower() in (c.name or '').lower()]
            total = len(classes_list)
        classes_list = classes_list[skip:skip + limit]
        result = {
            "classes": [ClassSchema(**class_to_dict(c)) for c in classes_list],
            "total": total
        }
        logger.debug(f"Retrieved classes for filiere: {result}")
        return result
    except Exception as e:
        logger.exception(f"Error retrieving classes for filiere {filiere_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving classes: {str(e)}")

def update_class(filiere_id: UUID, code: str, data: ClassUpdateSchema) -> Optional[ClassSchema]:
    try:
        existing = Class.objects(filiere_id=filiere_id, code=code).first()
        if not existing:
            return None
        update_data = data.dict(exclude_unset=True)
        logger.debug(f"Updating class (filiere_id: {filiere_id}, code: {code}) with data: {update_data}")
        for field, value in update_data.items():
            setattr(existing, field, value)
        existing.save()
        return ClassSchema(**class_to_dict(existing))
    except Exception as e:
        logger.exception(f"Error updating class: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating class: {str(e)}")

def delete_class(filiere_id: UUID, code: str) -> bool:
    try:
        existing = Class.objects(filiere_id=filiere_id, code=code).first()
        if not existing:
            return False
        existing.delete()
        logger.debug(f"Deleted class (filiere_id: {filiere_id}, code: {code})")
        return True
    except Exception as e:
        logger.exception(f"Error deleting class: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting class: {str(e)}")