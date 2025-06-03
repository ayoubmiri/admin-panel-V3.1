# import time
# import random
# import logging
# from cassandra.cluster import Cluster
# from cassandra.policies import DCAwareRoundRobinPolicy
# from cassandra.auth import PlainTextAuthProvider
# from cassandra.cqlengine import connection
# from cassandra.query import SimpleStatement
# from app.config import settings

# logger = logging.getLogger(__name__)
# logging.basicConfig(level=logging.INFO)

# # Global session cache
# _session = None

# # Schema definitions (tables and UDTs)
# SCHEMA_TABLES = [

#     # -- Create UDT for score details
#     """
#     CREATE TYPE IF NOT EXISTS score_detail (
#         cc decimal,
#         exam decimal,
#         final decimal
#     )
#     """,

#     # -- Users table (auth info, optional if using Keycloak only)
#     """
#     CREATE TABLE IF NOT EXISTS users (
#         username text PRIMARY KEY,
#         email text,
#         full_name text,
#         disabled boolean,
#         hashed_password text
#     )
#     """,

#     # -- Audit log
#     """
#     CREATE TABLE IF NOT EXISTS audit_log (
#         entity_type text,
#         id timeuuid,
#         entity_id uuid,
#         action text,
#         performed_by text,
#         event_timestamp timestamp,
#         PRIMARY KEY ((entity_type), id)
#     ) WITH CLUSTERING ORDER BY (id DESC)
#     """,

#     # -- Filieres (programs of study)
#     """
#     CREATE TABLE IF NOT EXISTS filieres (
#         id uuid PRIMARY KEY,
#         code text,
#         name text,
#         coordinator_id uuid,
#         description text,
#         duration text,
#         status text,
#         version int,
#         valid_from date,
#         valid_to date,
#         created_at timestamp,
#         updated_at timestamp
#     )
#     """,

#     # -- Modules
#     """
#     CREATE TABLE IF NOT EXISTS modules (
#         id uuid PRIMARY KEY,
#         filiere_id uuid,
#         code text,
#         name text,
#         description text,
#         status text,
#         semester text,
#         version int,
#         valid_from date,
#         valid_to date,
#         created_at timestamp,
#         updated_at timestamp
#     )
#     """,

#     # -- Elements
#     """
#     CREATE TABLE IF NOT EXISTS elements (
#         id uuid PRIMARY KEY,
#         module_id uuid,
#         code text,
#         name text,
#         semester text,
#         description text,
#         created_at timestamp,
#         updated_at timestamp
#     )
#     """,

#     # -- Classes
#     """
#     CREATE TABLE IF NOT EXISTS classes (
#         id uuid PRIMARY KEY,
#         filiere_id uuid,
#         code text,
#         name text,
#         academic_year text,
#         semester text,
#         created_at timestamp,
#         updated_at timestamp
#     )
#     """,

#     # -- Students
#     """
#     CREATE TABLE IF NOT EXISTS students (
#         id uuid PRIMARY KEY,
#         student_id text,
#         first_name text,
#         last_name text,
#         email text,
#         phone text,
#         filiere_id uuid,
#         class_id uuid,
#         student_type text,
#         year text,
#         status text,
#         address text,
#         date_of_birth date,
#         created_at timestamp,
#         updated_at timestamp
#     )
#     """,

#     # -- Teachers
#     """
#     CREATE TABLE IF NOT EXISTS teachers (
#         id uuid PRIMARY KEY,
#         teacher_id text,
#         first_name text,
#         last_name text,
#         email text,
#         phone text,
#         specialization text,
#         status text,
#         created_at timestamp,
#         updated_at timestamp
#     )
#     """,

#     # -- Teacher assignments
#     """
#     CREATE TABLE IF NOT EXISTS teacher_element_assignments (
#         teacher_id uuid,
#         filiere_id uuid,
#         module_id uuid,
#         element_id uuid,
#         class_id uuid,
#         academic_year text,
#         semester text,
#         PRIMARY KEY ((teacher_id), filiere_id, module_id, element_id, class_id, academic_year, semester)
#     )
#     """,

#     # -- Controls (tests/quizzes)
#     # """
#     # CREATE TABLE IF NOT EXISTS controls (
#     #     element_id uuid,
#     #     academic_year text,
#     #     semester text,
#     #     id timeuuid,
#     #     control_type text,
#     #     date timestamp,
#     #     created_at timestamp,
#     #     updated_at timestamp,
#     #     PRIMARY KEY ((element_id, academic_year, semester), id)
#     # ) WITH CLUSTERING ORDER BY (id DESC)
#     # """,

#     # -- Final Exams
#     """
#     CREATE TABLE IF NOT EXISTS final_exams (
#         element_id uuid,
#         academic_year text,
#         semester text,
#         id timeuuid,
#         date timestamp,
#         created_at timestamp,
#         updated_at timestamp,
#         PRIMARY KEY ((element_id, academic_year, semester), id)
#     ) WITH CLUSTERING ORDER BY (id DESC)
#     """,

#     # -- Grades
#     """
#     CREATE TABLE IF NOT EXISTS grades (
#         student_id uuid,
#         id uuid,
#         control_id timeuuid,
#         final_exam_id timeuuid,
#         scores frozen<score_detail>,
#         status text,
#         created_at timestamp,
#         updated_at timestamp,
#         PRIMARY KEY ((student_id), id)
#     )WITH CLUSTERING ORDER BY (id ASC);
#     """,

#     # -- Announcements
#     """
#     CREATE TABLE IF NOT EXISTS announcements (
#         id uuid PRIMARY KEY,
#         title text,
#         content text,
#         category text,
#         is_important boolean,
#         created_by text,
#         created_at timestamp,
#         updated_at timestamp
#     )
#     """,

#     # -- Students by class (denormalized)
#     """
#     CREATE TABLE IF NOT EXISTS students_by_class (
#         class_id uuid,
#         student_id uuid,
#         first_name text,
#         last_name text,
#         email text,
#         student_type text,
#         PRIMARY KEY (class_id, student_id)
#     )
#     """,

#     # -- Elements by teacher (denormalized)
#     """
#     CREATE TABLE IF NOT EXISTS elements_by_teacher (
#         teacher_id uuid,
#         element_id uuid,
#         filiere_id uuid,
#         module_id uuid,
#         class_id uuid,
#         academic_year text,
#         semester text,
#         PRIMARY KEY (teacher_id, element_id)
#     )
#     """,

#     # -- Controls by Teacher (optional)
#     """
#     CREATE TABLE IF NOT EXISTS controls_by_teacher (
#         teacher_id uuid,
#         element_id uuid,
#         control_id timeuuid,
#         control_type text,
#         date timestamp,
#         academic_year text,
#         semester text,
#         PRIMARY KEY ((teacher_id), control_id)
#     ) WITH CLUSTERING ORDER BY (control_id DESC)
#     """,

#     # -- Classes by Teacher (optional)
#     """
#     CREATE TABLE IF NOT EXISTS classes_by_teacher (
#         teacher_id uuid,
#         class_id uuid,
#         filiere_id uuid,
#         module_id uuid,
#         element_id uuid,
#         academic_year text,
#         semester text,
#         PRIMARY KEY ((teacher_id), class_id, academic_year, semester)
#     )
#     """
# ]

# # Indexes separated from tables to execute after all tables are created
# SCHEMA_INDEXES = [
#     "CREATE INDEX IF NOT EXISTS users_email_idx ON users (email)",
#     "CREATE INDEX IF NOT EXISTS students_email_idx ON students (email)",
#     "CREATE INDEX IF NOT EXISTS students_status_idx ON students (status)",
#     "CREATE INDEX IF NOT EXISTS announcements_created_by_idx ON announcements (created_by)",
#     "CREATE INDEX IF NOT EXISTS teachers_email_idx ON teachers (email)",
#     "CREATE INDEX IF NOT EXISTS teacher_element_assignments_class_idx ON teacher_element_assignments (class_id)",
#     "CREATE INDEX IF NOT EXISTS students_type_idx ON students (student_type)"

# ]
# # "CREATE INDEX IF NOT EXISTS classes_name_idx ON classes (name)"


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

#             load_balancing_policy = DCAwareRoundRobinPolicy(local_dc='datacenter1')  # Update if your DC name is different

#             cluster = Cluster(
#                 settings.CASSANDRA_HOSTS,
#                 port=settings.CASSANDRA_PORT,
#                 auth_provider=auth_provider,
#                 load_balancing_policy=load_balancing_policy,
#                 protocol_version=5,  # Match your Cassandra cluster version protocol
#                 connect_timeout=30
#             )

#             session = cluster.connect()

#             # Log Cassandra cluster version
#             row = session.execute("SELECT release_version FROM system.local").one()
#             cassandra_version = row.release_version if row else "Unknown"
#             logger.info(f"Connected to Cassandra cluster version: {cassandra_version}")

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
#                 logger.info(f"Executed schema statement: {stmt.splitlines()[0]}...")

#             # Run index creation statements AFTER tables
#             for idx in SCHEMA_INDEXES:
#                 session.execute(SimpleStatement(idx))
#                 logger.info(f"Executed index statement: {idx.split()[3]}...")

#             # Register session for ORM use
#             connection.register_connection('cluster', session=session)
#             connection.set_default_connection('cluster')
#             # connection.set_default_keyspace(settings.CASSANDRA_KEYSPACE)

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


import time
import random
import logging
from cassandra.cluster import Cluster
from cassandra.policies import DCAwareRoundRobinPolicy
from cassandra.auth import PlainTextAuthProvider
from cassandra.cqlengine import connection
from cassandra.query import SimpleStatement
from app.config import settings

# Configure logging
logging.basicConfig(level=logging.DEBUG, filename='app.log', filemode='a', format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Global session cache
_session = None

# Schema definitions (tables and UDTs)
SCHEMA_TABLES = [
    """
    CREATE TYPE IF NOT EXISTS score_detail (
        cc decimal,
        exam decimal,
        final decimal
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS users (
        username text PRIMARY KEY,
        email text,
        full_name text,
        disabled boolean,
        hashed_password text
    )
    """,
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
    """
    CREATE TABLE IF NOT EXISTS filieres (
        id uuid PRIMARY KEY,
        code text,
        name text,
        coordinator_id uuid,
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
    """
    CREATE TABLE IF NOT EXISTS modules (
        id uuid PRIMARY KEY,
        filiere_id uuid,
        code text,
        name text,
        description text,
        status text,
        semester text,
        version int,
        valid_from date,
        valid_to date,
        created_at timestamp,
        updated_at timestamp
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS elements (
        id uuid PRIMARY KEY,
        module_id uuid,
        code text,
        name text,
        semester text,
        description text,
        created_at timestamp,
        updated_at timestamp
    )
    """,
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
    ) WITH CLUSTERING ORDER BY (id ASC)
    """,
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

SCHEMA_INDEXES = [
    "CREATE INDEX IF NOT EXISTS users_email_idx ON users (email)",
    "CREATE INDEX IF NOT EXISTS students_email_idx ON students (email)",
    "CREATE INDEX IF NOT EXISTS students_status_idx ON students (status)",
    "CREATE INDEX IF NOT EXISTS announcements_created_by_idx ON announcements (created_by)",
    "CREATE INDEX IF NOT EXISTS teachers_email_idx ON teachers (email)",
    "CREATE INDEX IF NOT EXISTS teacher_element_assignments_class_idx ON teacher_element_assignments (class_id)",
    "CREATE INDEX IF NOT EXISTS students_type_idx ON students (student_type)"
]

def init_cassandra():
    global _session
    max_retries = 5
    base_delay = 2  # seconds

    # Filter valid hosts
    hosts = [host for host in settings.CASSANDRA_HOSTS if host not in ['0.0.0.0']]
    if not hosts:
        logger.error("No valid Cassandra hosts provided")
        raise ValueError("No valid Cassandra hosts provided")

    for attempt in range(max_retries):
        try:
            logger.info(f"Connecting to Cassandra (attempt {attempt + 1}/{max_retries})...")

            auth_provider = PlainTextAuthProvider(
                username=settings.CASSANDRA_USERNAME,
                password=settings.CASSANDRA_PASSWORD,
            )

            cluster = Cluster(
                contact_points=hosts,
                port=settings.CASSANDRA_PORT,
                auth_provider=auth_provider,
                load_balancing_policy=DCAwareRoundRobinPolicy(local_dc=settings.CASSANDRA_DC),
                protocol_version=5,
                connect_timeout=30
            )

            session = cluster.connect()
            logger.info(f"Connected to Cassandra cluster version: {session.execute('SELECT release_version FROM system.local').one().release_version}")

            # Create keyspace
            session.execute(f"""
                CREATE KEYSPACE IF NOT EXISTS {settings.CASSANDRA_KEYSPACE}
                WITH replication = {{'class': 'SimpleStrategy', 'replication_factor': 1}}
            """)
            session.set_keyspace(settings.CASSANDRA_KEYSPACE)

            # Create schema
            for stmt in SCHEMA_TABLES:
                session.execute(SimpleStatement(stmt))
                logger.debug(f"Executed schema: {stmt.splitlines()[0]}...")

            for idx in SCHEMA_INDEXES:
                session.execute(SimpleStatement(idx))
                logger.debug(f"Executed index: {idx.split()[3]}...")

            # Setup cqlengine without username/password
            connection.setup(
                hosts=hosts,
                default_keyspace=settings.CASSANDRA_KEYSPACE,
                port=settings.CASSANDRA_PORT,
                protocol_version=5,
                retry_connect=True
            )
            connection.register_connection('default', session=session, default=True)

            _session = session
            logger.info("Cassandra initialized")
            return session

        except Exception as e:
            logger.error(f"Cassandra connection attempt {attempt + 1} failed: {e}")
            if attempt == max_retries - 1:
                raise RuntimeError(f"Failed to connect to Cassandra after {max_retries} attempts: {e}")
            delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
            logger.info(f"Retrying in {delay:.2f} seconds...")
            time.sleep(delay)

def get_session():
    global _session
    if _session is None:
        logger.info("Session not initialized. Initializing Cassandra...")
        return init_cassandra()
    return _session