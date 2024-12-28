from .db_utils import get_db_connection
import sqlite3

def add_team(data):
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = f"INSERT INTO teams {generate_insert_query(data)}"
    cursor.execute(sql_query)
    conn.commit()
    conn.close()

def update_team(team_id, data):
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = f"UPDATE teams SET {generate_updae_query(data)} WHERE team_id = {team_id}"
    cursor.execute(sql_query)
    conn.commit()
    conn.close()

def delete_team(team_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = f"DELETE FROM teams WHERE team_id = {team_id}"
    cursor.execute(sql_query)
    conn.commit()
    conn.close()

def add_player(data):
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = f"INSERT INTO players {generate_insert_query(data["player"])}"
    cursor.execute(sql_query)
    new_id = cursor.lastrowid

    data["player_info"]["player_id"] = new_id
    sql_query = f"INSERT INTO player_infos {generate_insert_query(data["player_info"])}"
    cursor.execute(sql_query)

    conn.commit()
    conn.close()

def update_player(player_id, data):
    conn = get_db_connection()
    cursor = conn.cursor()

    if 'player' in data:
        sql_query = f"UPDATE players SET {generate_updae_query(data["player"])} WHERE player_id = {player_id}"
        cursor.execute(sql_query)

    if 'player_info' in data:
        sql_query = f"UPDATE player_infos SET {generate_updae_query(data["player_info"])} WHERE player_id = {player_id}"
        cursor.execute(sql_query)

    conn.commit()
    conn.close()

def delete_player(player_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = f"DELETE FROM players WHERE player_id = {player_id}"
    cursor.execute(sql_query)
    conn.commit()
    conn.close()


def generate_insert_query(data):
    keys = ', '.join(data.keys())
    values = ', '.join(f"'{v}'" if isinstance(v, str) else str(v) for v in data.values())

    return f"({keys}) VALUES ({values})"

def generate_updae_query(data):
    return ', '.join(f"{k} = '{v}'" if isinstance(v, str) else f"{k} = {v}" for k, v in data.items())
