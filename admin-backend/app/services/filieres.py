from typing import List, Optional
from uuid import UUID
from app.schemas.filieres import FiliereCreate, FiliereUpdate, FiliereInDB
from app.crud.filieres import (
    get_filiere,
    get_filieres,
    create_filiere,
    update_filiere,
    delete_filiere
)

def list_filieres(skip: int = 0, limit: int = 100) -> List[FiliereInDB]:
    return get_filieres(skip, limit)

def retrieve_filiere(filiere_id: UUID) -> Optional[FiliereInDB]:
    return get_filiere(filiere_id)

def create_new_filiere(filiere: FiliereCreate) -> FiliereInDB:
    return create_filiere(filiere)

def update_existing_filiere(filiere_id: UUID, filiere: FiliereUpdate) -> Optional[FiliereInDB]:
    return update_filiere(filiere_id, filiere)

def delete_existing_filiere(filiere_id: UUID) -> bool:
    return delete_filiere(filiere_id)
