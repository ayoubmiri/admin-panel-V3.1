import time
import random
import logging
from cassandra.cluster import Cluster
from cassandra.policies import DCAwareRoundRobinPolicy
from cassandra.auth import PlainTextAuthProvider
from cassandra.cqlengine import connection
from cassandra.query import SimpleStatement
from app.config import settings

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Global session cache
_session = None

# Schema definitions (tables and UDTs)
SCHEMA_TABLES = [

    # -- Create UDT for score details
    """
    CREATE TYPE IF NOT EXISTS score_detail (
        cc decimal,
        exam decimal,
        final decimal
    )
    """,

    # -- Users table (auth info, optional if using Keycloak only)
    """
    CREATE TABLE IF NOT EXISTS users (
        username text PRIMARY KEY,
        email text,
        full_name text,
        disabled boolean,
        hashed_password text
    )
    """,

    # -- Audit log
    """
    CREATE TABLE IF NOT EXISTS audit_log (
        entity_type text,
        id timeuuid,
        entity_id uuid,
        action text,
        performed_by text,
        event_timestamp timestamp,
        PRIMARY KEY ((entity_type), id)
    ) WITH CLUSTERING ORDER BY (id DESC)
    """,

    # -- Filieres (programs of study)
    """
    CREATE TABLE IF NOT EXISTS filieres (
        id uuid PRIMARY KEY,
        code text,
        name text,
        description text,
        duration text,
        status text,
        version int,
        valid_from date,
        valid_to date,
        created_at timestamp,
        updated_at timestamp
    )
    """,

    # -- Modules
    """
    CREATE TABLE IF NOT EXISTS modules (
        id uuid PRIMARY KEY,
        filiere_id uuid,
        code text,
        name text,
        description text,
        version int,
        valid_from date,
        valid_to date,
        created_at timestamp,
        updated_at timestamp
    )
    """,

    # -- Elements
    """
    CREATE TABLE IF NOT EXISTS elements (
        id uuid PRIMARY KEY,
        module_id uuid,
        code text,
        name text,
        description text,
        created_at timestamp,
        updated_at timestamp
    )
    """,

    # -- Classes
    """
    CREATE TABLE IF NOT EXISTS classes (
        id uuid PRIMARY KEY,
        filiere_id uuid,
        code text,
        name text,
        academic_year text,
        semester text,
        created_at timestamp,
        updated_at timestamp
    )
    """,

    # -- Students
    """
    CREATE TABLE IF NOT EXISTS students (
        id uuid PRIMARY KEY,
        student_id text,
        first_name text,
        last_name text,
        email text,
        phone text,
        filiere_id uuid,
        class_id uuid,
        student_type text,
        year text,
        status text,
        address text,
        date_of_birth date,
        created_at timestamp,
        updated_at timestamp
    )
    """,

    # -- Teachers
    """
    CREATE TABLE IF NOT EXISTS teachers (
        id uuid PRIMARY KEY,
        teacher_id text,
        first_name text,
        last_name text,
        email text,
        phone text,
        specialization text,
        status text,
        created_at timestamp,
        updated_at timestamp
    )
    """,

    # -- Teacher assignments
    """
    CREATE TABLE IF NOT EXISTS teacher_element_assignments (
        teacher_id uuid,
        filiere_id uuid,
        module_id uuid,
        element_id uuid,
        class_id uuid,
        academic_year text,
        semester text,
        PRIMARY KEY ((teacher_id), filiere_id, module_id, element_id, class_id, academic_year, semester)
    )
    """,

    # -- Controls (tests/quizzes)
    # """
    # CREATE TABLE IF NOT EXISTS controls (
    #     element_id uuid,
    #     academic_year text,
    #     semester text,
    #     id timeuuid,
    #     control_type text,
    #     date timestamp,
    #     created_at timestamp,
    #     updated_at timestamp,
    #     PRIMARY KEY ((element_id, academic_year, semester), id)
    # ) WITH CLUSTERING ORDER BY (id DESC)
    # """,

    # -- Final Exams
    """
    CREATE TABLE IF NOT EXISTS final_exams (
        element_id uuid,
        academic_year text,
        semester text,
        id timeuuid,
        date timestamp,
        created_at timestamp,
        updated_at timestamp,
        PRIMARY KEY ((element_id, academic_year, semester), id)
    ) WITH CLUSTERING ORDER BY (id DESC)
    """,

    # -- Grades
    """
    CREATE TABLE IF NOT EXISTS grades (
        student_id uuid,
        id uuid,
        control_id timeuuid,
        final_exam_id timeuuid,
        scores frozen<score_detail>,
        status text,
        created_at timestamp,
        updated_at timestamp,
        PRIMARY KEY ((student_id), id)
    )WITH CLUSTERING ORDER BY (id ASC);
    """,

    # -- Announcements
    """
    CREATE TABLE IF NOT EXISTS announcements (
        id uuid PRIMARY KEY,
        title text,
        content text,
        category text,
        is_important boolean,
        created_by text,
        created_at timestamp,
        updated_at timestamp
    )
    """,

    # -- Students by class (denormalized)
    """
    CREATE TABLE IF NOT EXISTS students_by_class (
        class_id uuid,
        student_id uuid,
        first_name text,
        last_name text,
        email text,
        student_type text,
        PRIMARY KEY (class_id, student_id)
    )
    """,

    # -- Elements by teacher (denormalized)
    """
    CREATE TABLE IF NOT EXISTS elements_by_teacher (
        teacher_id uuid,
        element_id uuid,
        filiere_id uuid,
        module_id uuid,
        class_id uuid,
        academic_year text,
        semester text,
        PRIMARY KEY (teacher_id, element_id)
    )
    """,

    # -- Controls by Teacher (optional)
    """
    CREATE TABLE IF NOT EXISTS controls_by_teacher (
        teacher_id uuid,
        element_id uuid,
        control_id timeuuid,
        control_type text,
        date timestamp,
        academic_year text,
        semester text,
        PRIMARY KEY ((teacher_id), control_id)
    ) WITH CLUSTERING ORDER BY (control_id DESC)
    """,

    # -- Classes by Teacher (optional)
    """
    CREATE TABLE IF NOT EXISTS classes_by_teacher (
        teacher_id uuid,
        class_id uuid,
        filiere_id uuid,
        module_id uuid,
        element_id uuid,
        academic_year text,
        semester text,
        PRIMARY KEY ((teacher_id), class_id, academic_year, semester)
    )
    """
]

# Indexes separated from tables to execute after all tables are created
SCHEMA_INDEXES = [
    "CREATE INDEX IF NOT EXISTS users_email_idx ON users (email)",
    "CREATE INDEX IF NOT EXISTS students_email_idx ON students (email)",
    "CREATE INDEX IF NOT EXISTS students_status_idx ON students (status)",
    "CREATE INDEX IF NOT EXISTS announcements_created_by_idx ON announcements (created_by)",
    "CREATE INDEX IF NOT EXISTS teachers_email_idx ON teachers (email)",
    "CREATE INDEX IF NOT EXISTS teacher_element_assignments_class_idx ON teacher_element_assignments (class_id)",
    "CREATE INDEX IF NOT EXISTS students_type_idx ON students (student_type)"

]
# "CREATE INDEX IF NOT EXISTS classes_name_idx ON classes (name)"


def init_cassandra():
    global _session
    max_retries = 5
    base_delay = 2  # seconds

    for attempt in range(max_retries):
        try:
            logger.info(f"Connecting to Cassandra (attempt {attempt + 1}/{max_retries})...")

            auth_provider = PlainTextAuthProvider(
                username=settings.CASSANDRA_USERNAME,
                password=settings.CASSANDRA_PASSWORD,
            )

            load_balancing_policy = DCAwareRoundRobinPolicy(local_dc='datacenter1')  # Update if your DC name is different

            cluster = Cluster(
                settings.CASSANDRA_HOSTS,
                port=settings.CASSANDRA_PORT,
                auth_provider=auth_provider,
                load_balancing_policy=load_balancing_policy,
                protocol_version=5,  # Match your Cassandra cluster version protocol
                connect_timeout=30
            )

            session = cluster.connect()

            # Log Cassandra cluster version
            row = session.execute("SELECT release_version FROM system.local").one()
            cassandra_version = row.release_version if row else "Unknown"
            logger.info(f"Connected to Cassandra cluster version: {cassandra_version}")

            # Create keyspace if not exists
            session.execute(f"""
                CREATE KEYSPACE IF NOT EXISTS {settings.CASSANDRA_KEYSPACE}
                WITH replication = {{'class': 'SimpleStrategy', 'replication_factor': 1}}
            """)
            session.set_keyspace(settings.CASSANDRA_KEYSPACE)
            logger.info(f"Keyspace '{settings.CASSANDRA_KEYSPACE}' is set.")

            # Run schema creation statements (tables and UDTs)
            for stmt in SCHEMA_TABLES:
                session.execute(SimpleStatement(stmt))
                logger.info(f"Executed schema statement: {stmt.splitlines()[0]}...")

            # Run index creation statements AFTER tables
            for idx in SCHEMA_INDEXES:
                session.execute(SimpleStatement(idx))
                logger.info(f"Executed index statement: {idx.split()[3]}...")

            # Register session for ORM use
            connection.register_connection('cluster', session=session)
            connection.set_default_connection('cluster')
            # connection.set_default_keyspace(settings.CASSANDRA_KEYSPACE)

            _session = session
            logger.info("Cassandra initialized with schema and indexes.")
            return session

        except Exception as e:
            logger.error(f"Cassandra connection attempt {attempt + 1} failed: {e}")
            if attempt == max_retries - 1:
                raise
            delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
            logger.info(f"Retrying in {delay:.2f} seconds...")
            time.sleep(delay)


def get_session():
    global _session
    if _session is None:
        logger.info("Session not initialized. Initializing Cassandra...")
        return init_cassandra()
    return _session



# def init_cassandra():
#     global _session
#     max_retries = 5
#     base_delay = 2  # seconds

#     for attempt in range(max_retries):
#         try:
#             logger.info(f"Connecting to Cassandra (attempt {attempt + 1}/{max_retries})...")
#             auth_provider = PlainTextAuthProvider(
#                 username=settings.CASSANDRA_USERNAME,
#                 password=settings.CASSANDRA_PASSWORD,
#             )

#             cluster = Cluster(
#                 settings.CASSANDRA_HOSTS,
#                 port=settings.CASSANDRA_PORT,
#                 auth_provider=auth_provider,
#                 connect_timeout=30
#             )
#             session = cluster.connect()

#             # Log Cassandra cluster version
#             row = session.execute("SELECT release_version FROM system.local").one()
#             cassandra_version = row.release_version if row else "Unknown"
#             logger.info(f"Connected to Cassandra cluster version: {cassandra_version}")

#             # Create keyspace if not exists
#             # Note: For production, consider using NetworkTopologyStrategy instead of SimpleStrategy
#             session.execute(f"""
#                 CREATE KEYSPACE IF NOT EXISTS {settings.CASSANDRA_KEYSPACE}
#                 WITH replication = {{'class': 'SimpleStrategy', 'replication_factor': 1}}
#             """)

#             session.set_keyspace(settings.CASSANDRA_KEYSPACE)
#             logger.info(f"Keyspace '{settings.CASSANDRA_KEYSPACE}' is set.")

#             # Run schema creation statements (tables and UDTs)
#             for stmt in SCHEMA_TABLES:
#                 session.execute(SimpleStatement(stmt))
#                 logger.info(f"Executed schema statement: {stmt.splitlines()[0]}...")

#             # Run index creation statements AFTER tables
#             for idx in SCHEMA_INDEXES:
#                 session.execute(SimpleStatement(idx))
#                 logger.info(f"Executed index statement: {idx.split()[3]}...")

#             # Register session for ORM use
#             connection.register_connection('cluster', session=session)
#             connection.set_default_connection('cluster')

#             _session = session
#             logger.info("Cassandra initialized with schema and indexes.")
#             return session

#         except Exception as e:
#             logger.error(f"Cassandra connection attempt {attempt + 1} failed: {e}")
#             if attempt == max_retries - 1:
#                 raise
#             delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
#             logger.info(f"Retrying in {delay:.2f} seconds...")
#             time.sleep(delay)


# def get_session():
#     global _session
#     if _session is None:
#         logger.info("Session not initialized. Initializing Cassandra...")
#         return init_cassandra()
#     return _session

# def init_cassandra():
#     global _session
#     max_retries = 5
#     retry_delay = 5  # seconds

#     for attempt in range(max_retries):
#         try:
#             logger.info(f"Connecting to Cassandra (attempt {attempt + 1}/{max_retries})...")
#             auth_provider = PlainTextAuthProvider(
#                 username=settings.CASSANDRA_USERNAME,
#                 password=settings.CASSANDRA_PASSWORD,
#             )
#             cluster = Cluster(
#                 settings.CASSANDRA_HOSTS,
#                 port=settings.CASSANDRA_PORT,
#                 auth_provider=auth_provider,
#                 connect_timeout=30
#             )
#             session = cluster.connect()

#             # Create keyspace if not exists
#             session.execute(f"""
#                 CREATE KEYSPACE IF NOT EXISTS {settings.CASSANDRA_KEYSPACE}
#                 WITH replication = {{'class': 'SimpleStrategy', 'replication_factor': 1}}
#             """)

#             session.set_keyspace(settings.CASSANDRA_KEYSPACE)
#             logger.info(f"Keyspace '{settings.CASSANDRA_KEYSPACE}' is set.")

#             # Run schema creation statements (tables and UDTs)
#             for stmt in SCHEMA_TABLES:
#                 session.execute(SimpleStatement(stmt))
#                 logger.info(f"Executed: {stmt.splitlines()[0]}...")

#             # Run index creation statements AFTER tables
#             for idx in SCHEMA_INDEXES:
#                 session.execute(SimpleStatement(idx))
#                 logger.info(f"Executed index: {idx.split()[3]}...")

#             # Register session for ORM use
#             connection.register_connection('cluster', session=session)
#             connection.set_default_connection('cluster')

#             _session = session
#             logger.info("Cassandra initialized with schema.")
#             return session

#         except Exception as e:
#             logger.error(f"Cassandra connection attempt {attempt + 1} failed: {e}")
#             if attempt == max_retries - 1:
#                 raise
#             logger.info(f"Retrying in {retry_delay} seconds...")
#             time.sleep(retry_delay)


# def get_session():
#     global _session
#     if _session is None:
#         logger.info("Session not initialized. Initializing Cassandra...")
#         return init_cassandra()
#     return _session





# import time
# import logging
# from cassandra.cluster import Cluster
# from cassandra.auth import PlainTextAuthProvider
# from cassandra.cqlengine import connection
# from cassandra.query import SimpleStatement
# from app.config import settings

# logger = logging.getLogger(__name__)
# logging.basicConfig(level=logging.INFO)

# # Global session cache
# _session = None

# # SCHEMA_STATEMENTS = [
# #     # Users table
# #     """
# #     CREATE TABLE IF NOT EXISTS users (
# #         username text PRIMARY KEY,
# #         email text,
# #         full_name text,
# #         disabled boolean,
# #         hashed_password text
# #     )
# #     """,
# #     # Students table
# #     """
# #     CREATE TABLE IF NOT EXISTS students (
# #         id uuid PRIMARY KEY,
# #         student_id text,
# #         first_name text,
# #         last_name text,
# #         email text,
# #         phone text,
# #         program text,
# #         year text,
# #         status text,
# #         address text,
# #         date_of_birth text,
# #         created_at timestamp,
# #         updated_at timestamp
# #     )
# #     """,
# #     # Teachers table
# #     """
# #     CREATE TABLE IF NOT EXISTS teachers (
# #         id uuid PRIMARY KEY,
# #         teacher_id text,
# #         first_name text,
# #         last_name text,
# #         email text,
# #         phone text,
# #         specialization text,
# #         status text,
# #         created_at timestamp,
# #         updated_at timestamp
# #     )
# #     """,
# #     # Programs table
# #     """
# #     CREATE TABLE IF NOT EXISTS programs (
# #         id uuid PRIMARY KEY,
# #         code text,
# #         name text,
# #         description text,
# #         duration text,
# #         status text,
# #         created_at timestamp,
# #         updated_at timestamp
# #     )
# #     """,
# #     # Courses table
# #     """
# #     CREATE TABLE IF NOT EXISTS courses (
# #         id uuid PRIMARY KEY,
# #         code text,
# #         name text,
# #         description text,
# #         program_id uuid,
# #         teacher_id uuid,
# #         credits int,
# #         status text,
# #         created_at timestamp,
# #         updated_at timestamp
# #     )
# #     """,
# #     # Schedule table
# #     """
# #     CREATE TABLE IF NOT EXISTS schedule (
# #         id uuid PRIMARY KEY,
# #         course_id uuid,
# #         day text,
# #         start_time text,
# #         end_time text,
# #         room text,
# #         created_at timestamp,
# #         updated_at timestamp
# #     )
# #     """,
# #     # Grades table
# #     """
# #     CREATE TABLE IF NOT EXISTS grades (
# #         id uuid PRIMARY KEY,
# #         student_id uuid,
# #         course_id uuid,
# #         cc_score decimal,
# #         exam_score decimal,
# #         final_score decimal,
# #         status text,
# #         created_at timestamp,
# #         updated_at timestamp
# #     )
# #     """,
# #     # Announcements table
# #     """
# #     CREATE TABLE IF NOT EXISTS announcements (
# #         id uuid PRIMARY KEY,
# #         title text,
# #         content text,
# #         category text,
# #         is_important boolean,
# #         created_by text,
# #         created_at timestamp,
# #         updated_at timestamp
# #     )
# #     """,
# #     # Indexes for students
# #     "CREATE INDEX IF NOT EXISTS students_email_idx ON students (email)",
# #     "CREATE INDEX IF NOT EXISTS students_program_idx ON students (program)",
# #     "CREATE INDEX IF NOT EXISTS students_status_idx ON students (status)",
# #     # Indexes for other tables
# #     "CREATE INDEX IF NOT EXISTS grades_student_id_idx ON grades (student_id)",
# #     "CREATE INDEX IF NOT EXISTS grades_course_id_idx ON grades (course_id)",
# #     "CREATE INDEX IF NOT EXISTS schedule_course_id_idx ON schedule (course_id)",
# #     "CREATE INDEX IF NOT EXISTS announcements_created_by_idx ON announcements (created_by)"
# # ]
# # SCHEMA_STATEMENTS = [


# # ]


# def init_cassandra():
#     global _session
#     max_retries = 5
#     retry_delay = 5  # seconds

#     for attempt in range(max_retries):
#         try:
#             logger.info(f"Connecting to Cassandra (attempt {attempt + 1}/{max_retries})...")
#             auth_provider = PlainTextAuthProvider(
#                 username='cassandra',
#                 password='cassandra'
#             )
#             cluster = Cluster(
#                 settings.CASSANDRA_HOSTS,
#                 port=settings.CASSANDRA_PORT,
#                 auth_provider=auth_provider,
#                 connect_timeout=30
#             )
#             session = cluster.connect()

#             # Create keyspace if not exists
#             session.execute(f"""
#                 CREATE KEYSPACE IF NOT EXISTS {settings.CASSANDRA_KEYSPACE}
#                 WITH replication = {{'class': 'SimpleStrategy', 'replication_factor': 1}}
#             """)

#             session.set_keyspace(settings.CASSANDRA_KEYSPACE)
#             logger.info(f"Keyspace '{settings.CASSANDRA_KEYSPACE}' is set.")

#             # Run schema creation statements
#             for stmt in SCHEMA_STATEMENTS:
#                 session.execute(SimpleStatement(stmt))
#                 logger.info(f"Executed: {stmt.splitlines()[0]}...")

#             # Register session for ORM use
#             connection.register_connection('cluster', session=session)
#             connection.set_default_connection('cluster')

#             _session = session
#             logger.info("Cassandra initialized with schema.")
#             return session

#         except Exception as e:
#             logger.error(f"Cassandra connection attempt {attempt + 1} failed: {e}")
#             if attempt == max_retries - 1:
#                 raise
#             logger.info(f"Retrying in {retry_delay} seconds...")
#             time.sleep(retry_delay)


# def get_session():
#     global _session
#     if _session is None:
#         logger.info("Session not initialized. Initializing Cassandra...")
#         return init_cassandra()
#     return _session



# import time
# import random
# import logging
# from cassandra.cluster import Cluster
# from cassandra.auth import PlainTextAuthProvider
# from cassandra.query import SimpleStatement
# from cassandra.cqlengine import connection

# from app.config import settings  # Adjust if needed
# from app.database.schema import SCHEMA_TABLES, SCHEMA_INDEXES  # Your schema definitions

# logger = logging.getLogger(__name__)
# _session = None  # Global session reference


# def init_cassandra():
#     global _session
#     max_retries = 5
#     base_delay = 2  # seconds

#     for attempt in range(max_retries):
#         try:
#             logger.info(f"Connecting to Cassandra (attempt {attempt + 1}/{max_retries})...")

#             # Auth Provider
#             auth_provider = PlainTextAuthProvider(
#                 username=settings.CASSANDRA_USERNAME,
#                 password=settings.CASSANDRA_PASSWORD,
#             )

#             # Optional SSL context setup for production (if SSL is enabled)
#             # from ssl import SSLContext, PROTOCOL_TLS
#             # ssl_context = SSLContext(PROTOCOL_TLS)
#             # ssl_options = {'ssl_context': ssl_context}

#             # Cassandra cluster connection
#             cluster = Cluster(
#                 contact_points=settings.CASSANDRA_HOSTS,
#                 port=settings.CASSANDRA_PORT,
#                 auth_provider=auth_provider,
#                 # ssl_options=ssl_options,  # Uncomment if SSL is used
#                 connect_timeout=30
#             )

#             session = cluster.connect()

#             # Log version
#             row = session.execute("SELECT release_version FROM system.local").one()
#             cassandra_version = row.release_version if row else "Unknown"
#             logger.info(f"Connected to Cassandra cluster version: {cassandra_version}")

#             # Create keyspace if not exists
#             session.execute(f"""
#                 CREATE KEYSPACE IF NOT EXISTS {settings.CASSANDRA_KEYSPACE}
#                 WITH replication = {{
#                     'class': 'NetworkTopologyStrategy', 
#                     '{settings.CASSANDRA_DATACENTER}': {settings.CASSANDRA_REPLICATION_FACTOR}
#                 }}
#             """)

#             session.set_keyspace(settings.CASSANDRA_KEYSPACE)
#             logger.info(f"Keyspace '{settings.CASSANDRA_KEYSPACE}' is set.")

#             # Create tables
#             for stmt in SCHEMA_TABLES:
#                 session.execute(SimpleStatement(stmt))
#                 logger.info(f"Executed schema statement: {stmt.strip().splitlines()[0]}...")

#             # Create indexes
#             for idx in SCHEMA_INDEXES:
#                 session.execute(SimpleStatement(idx))
#                 logger.info(f"Executed index statement: {idx.strip().split()[3]}...")

#             # Register session with cqlengine
#             connection.register_connection('cluster', session=session)
#             connection.set_default_connection('cluster')

#             _session = session
#             logger.info("Cassandra initialized with schema and indexes.")
#             return session

#         except Exception as e:
#             logger.error(f"Cassandra connection attempt {attempt + 1} failed: {e}")
#             if attempt == max_retries - 1:
#                 raise
#             delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
#             logger.info(f"Retrying in {delay:.2f} seconds...")
#             time.sleep(delay)


# def get_session():
#     global _session
#     if _session is None:
#         logger.info("Session not initialized. Initializing Cassandra...")
#         return init_cassandra()
#     return _session
