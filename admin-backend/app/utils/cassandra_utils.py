import os
from cassandra.query import SimpleStatement

def initialize_cassandra_schema(session):
    """
    Initialize Cassandra schema by executing the CQL file.
    """
    # Path to the CQL schema file
    cql_file_path = os.path.join(os.path.dirname(__file__), "../../migrations/initial_schema.cql")
    
    try:
        with open(cql_file_path, 'r') as file:
            cql_statements = file.read()
        
        # Split statements by semicolon and filter out empty strings
        statements = [stmt.strip() for stmt in cql_statements.split(';') if stmt.strip()]
        
        # Execute each statement
        for statement in statements:
            try:
                session.execute(SimpleStatement(statement))
            except Exception as e:
                print(f"Error executing statement: {statement[:50]}...: {str(e)}")
                continue
                
    except FileNotFoundError:
        print(f"CQL file not found at: {cql_file_path}")
    except Exception as e:
        print(f"Error initializing Cassandra schema: {str(e)}")