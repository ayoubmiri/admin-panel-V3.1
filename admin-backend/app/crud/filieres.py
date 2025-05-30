import logging
from typing import List, Optional
from uuid import uuid4, UUID
from datetime import date, datetime
from fastapi import HTTPException
from cassandra.cqlengine.management import sync_table
from cassandra.util import Date as CassandraDate
from app.database.models import Filiere
from app.schemas.filieres import FiliereCreate, FiliereUpdate, FiliereInDB

# Configure logging
logging.basicConfig(level=logging.DEBUG, filename='app.log', filemode='a', format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# sync_table(Filiere)  # Uncomment if you need to sync

# Helper function to convert Filiere model to dict
def filiere_to_dict(filiere: Filiere) -> dict:
    data = {c: getattr(filiere, c) for c in filiere._defined_columns}
    # Convert cassandra.util.Date to datetime.date for valid_from and valid_to
    for field in ['valid_from', 'valid_to']:
        if data.get(field) and isinstance(data[field], CassandraDate):
            try:
                data[field] = data[field].date()
            except (ValueError, TypeError) as e:
                logger.error(f"Invalid date for {field} in filiere {data.get('id')}: {data[field]}, error: {e}")
                data[field] = None  # Set to None to avoid validation error
    return data

def get_filiere(filiere_id: UUID) -> Optional[FiliereInDB]:
    try:
        filiere = Filiere.objects(id=filiere_id).first()
        return FiliereInDB(**filiere_to_dict(filiere)) if filiere else None
    except Exception as e:
        logger.exception(f"Error retrieving filiere: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving filiere: {str(e)}")

def get_filieres(skip: int = 0, limit: int = 100) -> List[FiliereInDB]:
    try:
        results = Filiere.objects.all()[skip:skip + limit]
        return [FiliereInDB(**filiere_to_dict(f)) for f in results]
    except Exception as e:
        logger.exception(f"Error retrieving filieres: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving filieres: {str(e)}")

def create_filiere(data: FiliereCreate) -> FiliereInDB:
    try:
        new_data = data.dict()
        new_data['id'] = uuid4()
        filiere = Filiere.create(**new_data)
        return FiliereInDB(**filiere_to_dict(filiere))
    except Exception as e:
        logger.exception(f"Error creating filiere: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating filiere: {str(e)}")

def update_filiere(filiere_id: UUID, data: FiliereUpdate) -> Optional[FiliereInDB]:
    try:
        filiere = Filiere.objects(id=filiere_id).first()
        if not filiere:
            return None
        update_data = data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(filiere, key, value)
        filiere.save()
        return FiliereInDB(**filiere_to_dict(filiere))
    except Exception as e:
        logger.exception(f"Error updating filiere: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating filiere: {str(e)}")

def delete_filiere(filiere_id: UUID) -> bool:
    try:
        filiere = Filiere.objects(id=filiere_id).first()
        if not filiere:
            return False
        filiere.delete()
        return True
    except Exception as e:
        logger.exception(f"Error deleting filiere: {e}")
        raise HTTPException(status_code=500, detail=f"Error deleting filiere: {str(e)}")






# from typing import List, Optional
# from uuid import uuid4, UUID
# from fastapi import HTTPException
# from cassandra.cqlengine.management import sync_table
# from app.database.models import Filiere
# from app.schemas.filieres import FiliereCreate, FiliereUpdate, FiliereInDB

# # sync_table(Filiere)  # Uncomment if you need to sync

# # Helper function to convert Filiere model to dict
# def filiere_to_dict(filiere: Filiere) -> dict:
#     return {c: getattr(filiere, c) for c in filiere._defined_columns}

# def get_filiere(filiere_id: UUID) -> Optional[FiliereInDB]:
#     try:
#         filiere = Filiere.objects(id=filiere_id).first()
#         return FiliereInDB(**filiere_to_dict(filiere)) if filiere else None
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error retrieving filiere: {e}")

# def get_filieres(skip: int = 0, limit: int = 100) -> List[FiliereInDB]:
#     try:
#         results = Filiere.objects.all()[skip:skip + limit]
#         return [FiliereInDB(**filiere_to_dict(f)) for f in results]
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error retrieving filieres: {e}")

# def create_filiere(data: FiliereCreate) -> FiliereInDB:
#     try:
#         new_data = data.dict()
#         new_data['id'] = uuid4()
#         filiere = Filiere.create(**new_data)
#         return FiliereInDB(**filiere_to_dict(filiere))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error creating filiere: {e}")

# def update_filiere(filiere_id: UUID, data: FiliereUpdate) -> Optional[FiliereInDB]:
#     try:
#         filiere = Filiere.objects(id=filiere_id).first()
#         if not filiere:
#             return None
#         update_data = data.dict(exclude_unset=True)
#         for key, value in update_data.items():
#             setattr(filiere, key, value)
#         filiere.save()
#         return FiliereInDB(**filiere_to_dict(filiere))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error updating filiere: {e}")

# def delete_filiere(filiere_id: UUID) -> bool:
#     try:
#         filiere = Filiere.objects(id=filiere_id).first()
#         if not filiere:
#             return False
#         filiere.delete()
#         return True
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error deleting filiere: {e}")



# # from typing import List, Optional
# # from uuid import uuid4, UUID
# # from fastapi import HTTPException
# # from cassandra.cqlengine.management import sync_table
# # from app.database.models import Filiere
# # from app.schemas.filieres import FiliereCreate, FiliereUpdate, FiliereInDB

# # # sync_table(Filiere)  # Uncomment if you need to sync

# # def get_filiere(filiere_id: UUID) -> Optional[FiliereInDB]:
# #     try:
# #         filiere = Filiere.objects(id=filiere_id).first()
# #         return FiliereInDB(**filiere._asdict()) if filiere else None
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=f"Error retrieving filiere: {e}")

# # def get_filieres(skip: int = 0, limit: int = 100) -> List[FiliereInDB]:
# #     try:
# #         results = Filiere.objects.all()[skip:skip + limit]
# #         return [FiliereInDB(**f._asdict()) for f in results]
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=f"Error retrieving filieres: {e}")

# # def create_filiere(data: FiliereCreate) -> FiliereInDB:
# #     try:
# #         new_data = data.dict()
# #         new_data['id'] = uuid4()
# #         filiere = Filiere.create(**new_data)
# #         return FiliereInDB(**filiere._asdict())
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=f"Error creating filiere: {e}")

# # def update_filiere(filiere_id: UUID, data: FiliereUpdate) -> Optional[FiliereInDB]:
# #     try:
# #         filiere = Filiere.objects(id=filiere_id).first()
# #         if not filiere:
# #             return None
# #         update_data = data.dict(exclude_unset=True)
# #         for key, value in update_data.items():
# #             setattr(filiere, key, value)
# #         filiere.save()
# #         return FiliereInDB(**filiere._asdict())
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=f"Error updating filiere: {e}")

# # def delete_filiere(filiere_id: UUID) -> bool:
# #     try:
# #         filiere = Filiere.objects(id=filiere_id).first()
# #         if not filiere:
# #             return False
# #         filiere.delete()
# #         return True
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=f"Error deleting filiere: {e}")

