from cassandra.cqlengine.query import DoesNotExist
from uuid import UUID
from app.database.models import Announcement
from app.schemas.announcements import AnnouncementCreate, AnnouncementUpdate

async def create_announcement(announcement: AnnouncementCreate, user: dict):
    announcement_data = announcement.dict()
    announcement_data['author_id'] = UUID(user['sub'])
    return Announcement.create(**announcement_data)

async def get_announcement_by_id(announcement_id: str):
    try:
        return Announcement.objects(id=UUID(announcement_id)).first()
    except DoesNotExist:
        return None

async def get_announcements(skip: int = 0, limit: int = 100, is_important: bool = None):
    query = Announcement.objects.all()
    if is_important is not None:
        query = query.filter(is_important=is_important)
    return list(query[skip:skip + limit])

async def update_announcement(announcement_id: str, announcement: AnnouncementUpdate, user: dict):
    existing = Announcement.objects(id=UUID(announcement_id)).first()
    if not existing:
        return None
    
    # Verify the user is the author or admin
    if str(existing.author_id) != user['sub'] and 'admin' not in user.get('realm_access', {}).get('roles', []):
        raise HTTPException(status_code=403, detail="Not authorized to update this announcement")
    
    for field, value in announcement.dict(exclude_unset=True).items():
        setattr(existing, field, value)
    existing.save()
    return existing

async def delete_announcement(announcement_id: str, user: dict):
    announcement = Announcement.objects(id=UUID(announcement_id)).first()
    if announcement:
        # Verify the user is the author or admin
        if str(announcement.author_id) != user['sub'] and 'admin' not in user.get('realm_access', {}).get('roles', []):
            raise HTTPException(status_code=403, detail="Not authorized to delete this announcement")
        announcement.delete()