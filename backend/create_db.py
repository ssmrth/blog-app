import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_database():
    # Connect to PostgreSQL server
    conn = psycopg2.connect(
        dbname='postgres',
        user='postgres',
        password='postgres',
        host='localhost',
        port='5432'
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    # Check if database exists
    cursor.execute("SELECT 1 FROM pg_database WHERE datname = 'blogdb'")
    exists = cursor.fetchone()
    
    if not exists:
        print("Creating database 'blogdb'...")
        cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier('blogdb')))
        print("Database 'blogdb' created successfully!")
    else:
        print("Database 'blogdb' already exists.")
    
    cursor.close()
    conn.close()

if __name__ == "__main__":
    try:
        create_database()
    except Exception as e:
        print(f"Error: {e}")
