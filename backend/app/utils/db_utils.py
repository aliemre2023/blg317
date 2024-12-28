import sqlite3


def get_db_connection():
    conn = sqlite3.connect("../database/nba_db.sqlite")

    # Enable foreign key constraint
    conn.execute("PRAGMA foreign_keys = ON;")

    conn.row_factory = sqlite3.Row
    return conn
