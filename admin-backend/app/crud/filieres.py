from typing import List, Optional
from uuid import uuid4, UUID
from fastapi import HTTPException
from cassandra.cqlengine.management import sync_table
from app.database.models import Filiere
from app.schemas.filieres import FiliereCreate, FiliereUpdate, FiliereInDB

# sync_table(Filiere)  # Uncomment if you need to sync

def get_filiere(filiere_id: UUID) -> Optional[FiliereInDB]:
    try:
        filiere = Filiere.objects(id=filiere_id).first()
        return FiliereInDB(**filiere._asdict()) if filiere else None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving filiere: {e}")

def get_filieres(skip: int = 0, limit: int = 100) -> List[FiliereInDB]:
    try:
        results = Filiere.objects.all()[skip:skip + limit]
        return [FiliereInDB(**f._asdict()) for f in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving filieres: {e}")

def create_filiere(data: FiliereCreate) -> FiliereInDB:
    try:
        new_data = data.dict()
        new_data['id'] = uuid4()
        filiere = Filiere.create(**new_data)
        return FiliereInDB(**filiere._asdict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating filiere: {e}")

def update_filiere(filiere_id: UUID, data: FiliereUpdate) -> Optional[FiliereInDB]:
    try:
        filiere = Filiere.objects(id=filiere_id).first()
        if not filiere:
            return None
        update_data = data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(filiere, key, value)
        filiere.save()
        return FiliereInDB(**filiere._asdict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating filiere: {e}")

def delete_filiere(filiere_id: UUID) -> bool:
    try:
        filiere = Filiere.objects(id=filiere_id).first()
        if not filiere:
            return False
        filiere.delete()
        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting filiere: {e}")

