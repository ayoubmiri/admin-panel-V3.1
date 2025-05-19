from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
from cassandra.cqlengine import connection
from app.config import settings
import time

def init_cassandra():
    max_retries = 5
    retry_delay = 5  # seconds
    
    for attempt in range(max_retries):
        try:
            auth_provider = PlainTextAuthProvider(
                username='cassandra', 
                password='cassandra'
            )
            cluster = Cluster(
                settings.CASSANDRA_HOSTS,
                port=settings.CASSANDRA_PORT,
                auth_provider=auth_provider,
                connect_timeout=30  # Increased timeout
            )
            session = cluster.connect()
            
            # Create keyspace if not exists
            session.execute(f"""
            CREATE KEYSPACE IF NOT EXISTS {settings.CASSANDRA_KEYSPACE}
            WITH replication = {{'class': 'SimpleStrategy', 'replication_factor': 1}}
            """)
            
            session.set_keyspace(settings.CASSANDRA_KEYSPACE)
            
            connection.register_connection('cluster', session=session)
            connection.set_default_connection('cluster')
            
            return session
            
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            print(f"Connection attempt {attempt + 1} failed, retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)