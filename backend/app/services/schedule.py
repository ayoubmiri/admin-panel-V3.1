from cassandra.cqlengine.query import DoesNotExist
from uuid import UUID
from app.database.models import Schedule
from app.schemas.schedule import ScheduleCreate, ScheduleUpdate

async def create_schedule_item(schedule: ScheduleCreate):
    schedule_data = schedule.dict()
    return Schedule.create(**schedule_data)

async def get_schedule_item(schedule_id: str):
    try:
        return Schedule.objects(id=UUID(schedule_id)).first()
    except DoesNotExist:
        return None

async def get_schedule_items(skip: int = 0, limit: int = 100):
    return list(Schedule.objects.all()[skip:skip + limit])

async def update_schedule_item(schedule_id: str, schedule: ScheduleUpdate):
    existing = Schedule.objects(id=UUID(schedule_id)).first()
    if not existing:
        return None
    
    for field, value in schedule.dict(exclude_unset=True).items():
        setattr(existing, field, value)
    existing.save()
    return existing

async def delete_schedule_item(schedule_id: str):
    schedule = Schedule.objects(id=UUID(schedule_id)).first()
    if schedule:
        schedule.delete()