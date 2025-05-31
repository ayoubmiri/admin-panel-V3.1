from cassandra.cqlengine import columns
from cassandra.cqlengine.models import Model
from datetime import datetime
from uuid import uuid1, uuid4
from cassandra.util import uuid_from_time
from cassandra.cqlengine.usertype import UserType
from cassandra.cqlengine import management
from app.config import settings


# Base model with common fields
class BaseModel(Model):
    __abstract__ = True
    __keyspace__ = settings.CASSANDRA_KEYSPACE
    id = columns.UUID(primary_key=True, default=uuid1)
    created_at = columns.DateTime(default=datetime.utcnow)
    updated_at = columns.DateTime(default=datetime.utcnow)


# Define the User Defined Type (UDT) for score_detail
class ScoreDetail(UserType):
    cc = columns.Decimal()
    exam = columns.Decimal()
    final = columns.Decimal()


# Users table
class User(BaseModel):
    __table_name__ = 'users'
    username = columns.Text(required=True, index=True)
    email = columns.Text(required=True, index=True)
    full_name = columns.Text()
    hashed_password = columns.Text(required=True)
    disabled = columns.Boolean(default=False)

# Audit log table
class AuditLog(Model):
    __table_name__ = 'audit_log'
    entity_type = columns.Text(partition_key=True)
    id = columns.TimeUUID(primary_key=True, default=uuid_from_time(datetime.utcnow()))
    entity_id = columns.UUID()
    action = columns.Text()
    performed_by = columns.Text()
    event_timestamp = columns.DateTime(default=datetime.utcnow)

# Filiere table
class Filiere(BaseModel):
    __table_name__ = 'filieres'
    code = columns.Text(required=True, index=True)
    name = columns.Text(required=True)
    description = columns.Text()
    duration = columns.Text()
    coordinator_id = columns.UUID()
    status = columns.Text(default='active')
    version = columns.Integer()
    valid_from = columns.Date()
    valid_to = columns.Date()

# Module table
class Module(BaseModel):
    __table_name__ = 'modules'
    filiere_id = columns.UUID(required=True)
    code = columns.Text(required=True, index=True)
    name = columns.Text(required=True)
    description = columns.Text()
    status = columns.Text(default='active')
    version = columns.Integer()
    semester = columns.Text()
    valid_from = columns.Date()
    valid_to = columns.Date()

# Element table
class Element(BaseModel):
    __table_name__ = 'elements'
    module_id = columns.UUID(required=True)
    code = columns.Text(required=True, index=True)
    name = columns.Text(required=True)
    description = columns.Text()
    semester = columns.Text()

# Class table
class Class(BaseModel):
    __table_name__ = 'classes'
    filiere_id = columns.UUID(required=True)
    code = columns.Text(required=True, index=True)
    name = columns.Text(required=True)
    academic_year = columns.Text()
    semester = columns.Text()

# Student table
class Student(BaseModel):
    __table_name__ = 'students'
    student_id = columns.Text(required=True, index=True)
    first_name = columns.Text(required=True)
    last_name = columns.Text(required=True)
    email = columns.Text(required=True, index=True)
    phone = columns.Text()
    filiere_id = columns.UUID(required=True)
    class_id = columns.UUID()
    student_type = columns.Text()
    year = columns.Text()
    status = columns.Text(default='active')
    address = columns.Text()
    date_of_birth = columns.Date()

# Teacher table
class Teacher(BaseModel):
    __table_name__ = 'teachers'
    teacher_id = columns.Text(required=True, index=True)
    first_name = columns.Text(required=True)
    last_name = columns.Text(required=True)
    email = columns.Text(required=True, index=True)
    phone = columns.Text()
    specialization = columns.Text()
    status = columns.Text(default='active')

# TeacherElementAssignment table
class TeacherElementAssignment(Model):
    __keyspace__ = settings.CASSANDRA_KEYSPACE
    __table_name__ = 'teacher_element_assignments'
    teacher_id = columns.UUID(partition_key=True)
    filiere_id = columns.UUID(primary_key=True)
    module_id = columns.UUID(primary_key=True)
    element_id = columns.UUID(primary_key=True)
    class_id = columns.UUID(primary_key=True)
    academic_year = columns.Text(primary_key=True)
    semester = columns.Text(primary_key=True)

# Control table
# class Control(BaseModel):
#     __table_name__ = 'controls'
#    # Composite Partition Key
#     element_id = columns.UUID(partition_key=True)
#     academic_year = columns.Text(partition_key=True)
#     semester = columns.Text(partition_key=True)

#     # Clustering Key with descending order
#     id = columns.TimeUUID(primary_key=True, clustering_order="DESC", default=lambda: uuid_from_time(datetime.utcnow()))

#     control_type = columns.Text()
#     date = columns.DateTime()
#     created_at = columns.DateTime(default=datetime.utcnow)
#     updated_at = columns.DateTime(default=datetime.utcnow)



# class Control(BaseModel):
#     __table_name__ = 'controls'
#     element_id = columns.UUID(partition_key=True)
#     academic_year = columns.Text(partition_key=True)
#     semester = columns.Text(partition_key=True)
#     id = columns.TimeUUID(primary_key=True, default=lambda: uuid_from_time(datetime.utcnow()))
#     control_type = columns.Text()
#     date = columns.DateTime()
#     created_at = columns.DateTime(default=datetime.utcnow)
#     updated_at = columns.DateTime(default=datetime.utcnow)

# FinalExam table
class FinalExam(BaseModel):
    __table_name__ = 'final_exams'
    element_id = columns.UUID(partition_key=True)
    academic_year = columns.Text(partition_key=True)
    semester = columns.Text(partition_key=True)
    id = columns.TimeUUID(primary_key=True, default=uuid_from_time(datetime.utcnow()))
    date = columns.DateTime()
    created_at = columns.DateTime(default=datetime.utcnow)
    updated_at = columns.DateTime(default=datetime.utcnow)

# Grade table
# class Grade(BaseModel):
#     __table_name__ = 'grades'
#     student_id = columns.UUID(partition_key=True)
#     id = columns.UUID(primary_key=True, default=uuid4)
#     control_id = columns.TimeUUID()
#     final_exam_id = columns.TimeUUID()
#     scores = columns.UserDefinedType(ScoreDetail)
#     status = columns.Text()
#     created_at = columns.DateTime(default=datetime.utcnow)
#     updated_at = columns.DateTime(default=datetime.utcnow)

# Announcement table
class Announcement(BaseModel):
    __table_name__ = 'announcements'
    title = columns.Text(required=True)
    content = columns.Text(required=True)
    category = columns.Text()
    is_important = columns.Boolean(default=False)
    created_by = columns.Text()
    tags = columns.List(columns.Text)

# StudentsByClass table
class StudentsByClass(Model):
    __table_name__ = 'students_by_class'
    class_id = columns.UUID(partition_key=True)
    student_id = columns.UUID(primary_key=True)
    first_name = columns.Text()
    last_name = columns.Text()
    email = columns.Text()
    student_type = columns.Text()

# ElementsByTeacher table
class ElementsByTeacher(Model):
    __table_name__ = 'elements_by_teacher'
    teacher_id = columns.UUID(partition_key=True)
    element_id = columns.UUID(primary_key=True)
    filiere_id = columns.UUID()
    module_id = columns.UUID()
    class_id = columns.UUID()
    academic_year = columns.Text()
    semester = columns.Text()

# ControlsByTeacher table
class ControlsByTeacher(Model):
    __table_name__ = 'controls_by_teacher'
    teacher_id = columns.UUID(partition_key=True)
    control_id = columns.TimeUUID(primary_key=True, default=uuid_from_time(datetime.utcnow()))
    element_id = columns.UUID()
    control_type = columns.Text()
    date = columns.DateTime()
    academic_year = columns.Text()
    semester = columns.Text()

# ClassesByTeacher table
class ClassesByTeacher(Model):
    __table_name__ = 'classes_by_teacher'
    teacher_id = columns.UUID(partition_key=True)
    class_id = columns.UUID(primary_key=True)
    filiere_id = columns.UUID()
    module_id = columns.UUID()
    element_id = columns.UUID()
    academic_year = columns.Text()
    semester = columns.Text()



# from cassandra.cqlengine import columns
# from cassandra.cqlengine.models import Model
# from app.config import settings

# from datetime import datetime
# from uuid import uuid1


# class BaseModel(Model):
#     __abstract__ = True
#     __keyspace__ = settings.CASSANDRA_KEYSPACE
#     id = columns.UUID(primary_key=True, default=uuid1)
#     created_at = columns.DateTime(default=datetime.utcnow)
#     updated_at = columns.DateTime(default=datetime.utcnow)


# class User(BaseModel):
#     __table_name__ = 'users'
#     username = columns.Text(primary_key=True)
#     email = columns.Text(index=True, required=True)
#     full_name = columns.Text()
#     hashed_password = columns.Text(required=True)
#     disabled = columns.Boolean(default=False)


# class Filiere(BaseModel):
#     __table_name__ = 'filieres'
#     id = columns.UUID(primary_key=True, default=uuid1)
#     code = columns.Text(required=True, index=True)
#     name = columns.Text(required=True)
#     description = columns.Text()
#     duration = columns.Text()
#     status = columns.Text(default='active')
#     version = columns.Integer(default=1)
#     valid_from = columns.Date()
#     valid_to = columns.Date()


# class Module(BaseModel):
#     __table_name__ = 'modules'
#     id = columns.UUID(primary_key=True, default=uuid1)
#     filiere_id = columns.UUID(required=True, index=True)
#     code = columns.Text(required=True, index=True)
#     name = columns.Text(required=True)
#     description = columns.Text()
#     version = columns.Integer(default=1)
#     valid_from = columns.Date()
#     valid_to = columns.Date()
#     status = columns.Text(default='active')


# class Element(BaseModel):
#     __table_name__ = 'elements'
#     id = columns.UUID(primary_key=True, default=uuid1)
#     module_id = columns.UUID(required=True, index=True)
#     code = columns.Text(required=True, index=True)
#     name = columns.Text(required=True)
#     description = columns.Text()
#     status = columns.Text(default='active')


# class Student(BaseModel):
#     __table_name__ = 'students'
#     id = columns.UUID(primary_key=True, default=uuid1)
#     student_id = columns.Text(required=True, index=True)
#     first_name = columns.Text(required=True)
#     last_name = columns.Text(required=True)
#     email = columns.Text(required=True, index=True)
#     phone = columns.Text()
#     address = columns.Text()
#     date_of_birth = columns.Date()
#     filiere_id = columns.UUID(required=True, index=True)
#     class_id = columns.UUID(index=True)
#     student_type = columns.Text()
#     year = columns.Text()
#     status = columns.Text(default='active')


# class Teacher(BaseModel):
#     __table_name__ = 'teachers'
#     id = columns.UUID(primary_key=True, default=uuid1)
#     teacher_id = columns.Text(required=True, index=True)
#     first_name = columns.Text(required=True)
#     last_name = columns.Text(required=True)
#     email = columns.Text(required=True, index=True)
#     phone = columns.Text()
#     specialization = columns.Text()
#     status = columns.Text(default='active')


# class TeacherElementAssignment(BaseModel):
#     __table_name__ = 'teacher_element_assignments'
#     teacher_id = columns.UUID(partition_key=True)
#     filiere_id = columns.UUID(primary_key=True, clustering_order="ASC")
#     module_id = columns.UUID(primary_key=True, clustering_order="ASC")
#     element_id = columns.UUID(primary_key=True, clustering_order="ASC")
#     class_id = columns.UUID(primary_key=True, clustering_order="ASC")
#     academic_year = columns.Text(primary_key=True, clustering_order="ASC")
#     semester = columns.Text(primary_key=True, clustering_order="ASC")
#     assigned_at = columns.DateTime(default=datetime.utcnow)


# class Schedule(BaseModel):
#     __table_name__ = 'schedule'
#     id = columns.UUID(primary_key=True, default=uuid1)
#     element_id = columns.UUID(required=True, index=True)
#     day = columns.Text(required=True)
#     start_time = columns.Time(required=True)
#     end_time = columns.Time(required=True)
#     room = columns.Text()
#     teacher_id = columns.UUID(index=True)


# class Grade(BaseModel):
#     __table_name__ = 'grades'
#     id = columns.UUID(primary_key=True, default=uuid1)
#     student_id = columns.UUID(required=True, index=True)
#     element_id = columns.UUID(required=True, index=True)
#     cc_score = columns.Decimal()
#     exam_score = columns.Decimal()
#     final_score = columns.Decimal()
#     status = columns.Text(default='pending')
#     created_at = columns.DateTime(default=datetime.utcnow)
#     updated_at = columns.DateTime(default=datetime.utcnow)


# class Announcement(BaseModel):
#     __table_name__ = 'announcements'
#     id = columns.UUID(primary_key=True, default=uuid1)
#     title = columns.Text(required=True)
#     content = columns.Text(required=True)
#     category = columns.Text(index=True)
#     created_by = columns.Text(index=True)
#     is_important = columns.Boolean(default=False)
#     tags = columns.List(value_type=columns.Text)
