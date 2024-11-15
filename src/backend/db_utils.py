import sqlite3

# General functions to establish a database connection
def get_db_connection():
    conn = sqlite3.connect('../db/nba_db.sqlite')  # Update with your database path
    conn.row_factory = sqlite3.Row  # Helps to return rows as dictionaries
    return conn
