from cassandra.cqlengine.query import DoesNotExist
from app.database.models import Class  # Assuming your model is in models/class_model.py
from app.schemas.classes import ClassCreateSchema, ClassUpdateSchema

def create_class(data: ClassCreateSchema):
    return Class.create(**data.dict())

def get_class(filiere_id, code):
    try:
        return Class.get(filiere_id=filiere_id, code=code)
    except DoesNotExist:
        return None

def list_classes_by_filiere(filiere_id):
    return Class.objects(filiere_id=filiere_id).all()

def update_class(filiere_id, code, data: ClassUpdateSchema):
    existing = get_class(filiere_id, code)
    if not existing:
        return None
    for field, value in data.dict(exclude_unset=True).items():
        setattr(existing, field, value)
    existing.save()
    return existing

def delete_class(filiere_id, code):
    existing = get_class(filiere_id, code)
    if not existing:
        return None
    existing.delete()
    return True
