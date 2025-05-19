from cassandra.cqlengine import columns, models
from cassandra.cqlengine.models import Model
from datetime import datetime
from uuid import uuid1

class BaseModel(Model):
    __abstract__ = True
    __keyspace__ = 'est_sale'
    id = columns.UUID(primary_key=True, default=uuid1)
    created_at = columns.DateTime(default=datetime.utcnow)
    updated_at = columns.DateTime(default=datetime.utcnow)

class Student(BaseModel):
    __table_name__ = 'students'
    student_id = columns.Text(required=True, index=True)
    first_name = columns.Text(required=True)
    last_name = columns.Text(required=True)
    email = columns.Text(required=True, index=True)
    phone = columns.Text()
    program = columns.Text()
    year = columns.Text()
    status = columns.Text(default='active')

class Teacher(BaseModel):
    __table_name__ = 'teachers'
    teacher_id = columns.Text(required=True, index=True)
    first_name = columns.Text(required=True)
    last_name = columns.Text(required=True)
    email = columns.Text(required=True, index=True)
    phone = columns.Text()
    specialization = columns.Text()
    status = columns.Text(default='active')

class Course(BaseModel):
    __table_name__ = 'courses'
    code = columns.Text(required=True, index=True)
    name = columns.Text(required=True)
    description = columns.Text()
    credits = columns.Integer()
    program = columns.Text()

class Announcement(BaseModel):
    __table_name__ = 'announcements'
    title = columns.Text(required=True)
    content = columns.Text(required=True)
    author_id = columns.UUID(required=True)
    is_important = columns.Boolean(default=False)
    tags = columns.List(columns.Text)

class Schedule(BaseModel):
    __table_name__ = 'schedule'
    course_id = columns.UUID(required=True)
    day_of_week = columns.Text(required=True)
    start_time = columns.Time(required=True)
    end_time = columns.Time(required=True)
    room = columns.Text()
    teacher_id = columns.UUID()

class Grade(BaseModel):
    __table_name__ = 'grades'
    student_id = columns.UUID(required=True, index=True)
    course_id = columns.UUID(required=True, index=True)
    assignment = columns.Text(required=True)
    score = columns.Decimal(required=True)
    max_score = columns.Decimal(required=True)
    comments = columns.Text()