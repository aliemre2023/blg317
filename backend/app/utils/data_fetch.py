# data_fetch.py
import os
from .db_utils import get_db_connection
import sqlite3

# Function to load and execute a query from a specified SQL file
def fetch_from_sql_file(filename):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Construct the full file path and load the SQL query from the file
    sql_file_path = os.path.join('../database/queries', filename)
    with open(sql_file_path, 'r') as file:
        query = file.read()
    
    # Execute the query and fetch results
    cursor.execute(query)
    results = cursor.fetchall()
    conn.close()
    
    return results

def get_countries(query=None, page=1, per_page=24):
    conn = get_db_connection()
    cursor = conn.cursor()

    if query:
        sql_query = "SELECT country_id, name, flag_link FROM countries WHERE name LIKE ? LIMIT ? OFFSET ?"
        params = (f"{query}%", per_page, (page - 1) * per_page)
    else:
        sql_query = "SELECT country_id, name, flag_link FROM countries LIMIT ? OFFSET ?"
        params = (per_page, (page - 1) * per_page)

    cursor.execute(sql_query, params)
    countries = cursor.fetchall()

    if query:
        count_query = "SELECT COUNT(*) FROM countries WHERE name LIKE ?"
        cursor.execute(count_query, (f"{query}%",))
    else:
        count_query = "SELECT COUNT(*) FROM countries"
        cursor.execute(count_query)

    total_count = cursor.fetchone()[0]

    conn.close()
    return countries, total_count

def get_teams(query=None, page=1, per_page=24):
    conn = get_db_connection()
    cursor = conn.cursor()

    if query:
        sql_query = """
            SELECT team_id, abbreviation, nickname, logo_url
            FROM teams
            WHERE nickname LIKE ?
            LIMIT ? OFFSET ?
        """
        params = (f"{query}%", per_page, (page - 1) * per_page)
    else:
        sql_query = """
            SELECT team_id, abbreviation, nickname, logo_url
            FROM teams
            LIMIT ? OFFSET ?
        """
        params = (per_page, (page - 1) * per_page)

    cursor.execute(sql_query, params)
    teams = cursor.fetchall()

    if query:
        count_query = "SELECT COUNT(*) FROM teams WHERE nickname LIKE ?"
        cursor.execute(count_query, (f"{query}%",))
    else:
        count_query = "SELECT COUNT(*) FROM teams"
        cursor.execute(count_query)

    total_count = cursor.fetchone()[0]

    conn.close()
    return teams, total_count

def get_numberOfTeamsInCountry():
    team_number_in_country = fetch_from_sql_file("team_number_in_country.sql")
    return team_number_in_country

def get_numberOfPlayersInCountry():
    player_number_in_country = fetch_from_sql_file("player_number_in_country.sql")
    return player_number_in_country

def getLastGames(limit=5):
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = """
        SELECT
            g.game_id,
            g.date,
            g.home_team_id,
            t1.name AS home_team_name,
            gs.home_team_score AS home_team_score,
            g.away_team_id,
            t2.name AS away_team_name,
            gs.away_team_score AS away_team_score,
            o.first_name || ' ' || o.last_name AS official_name
        FROM games g
        LEFT JOIN teams t1 ON g.home_team_id = t1.team_id
        LEFT JOIN teams t2 ON g.away_team_id = t2.team_id
        LEFT JOIN officials o ON g.official_id = o.official_id
        LEFT JOIN game_stats gs ON g.game_id = gs.game_id
        ORDER BY g.date DESC
        LIMIT ?
    """
    params = (limit,)

    cursor.execute(sql_query, params)
    games = cursor.fetchall()

    conn.close()
    return games
  
def get_countryPlayers(query, page=1, per_page=24):
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = """
        SELECT p.player_id, p.first_name, p.last_name, p.height, p.weight, p.birth_date, p.college 
        FROM players p
        NATURAL JOIN countries c
        WHERE c.country_id = ?
        LIMIT ? OFFSET ?
    """
    params = (query, per_page, (page - 1) * per_page)

    cursor.execute(sql_query, params)
    country_players = cursor.fetchall()

    sql_query = """
        SELECT COUNT(*)
        FROM players p
        NATURAL JOIN countries c
        WHERE c.country_id = ?
    """

    cursor.execute(sql_query, (query,))
    total_count = cursor.fetchone()[0]

    return country_players, total_count

def get_countryTeams(query, page=1, per_page=24):
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = """
        SELECT t.team_id, t.nickname as name, t.owner, t.general_manager, t.headcoach, c.name as city_name, a.name as arena_name, t.year_founded, t.instagram
        FROM teams t
        JOIN arenas a ON t.arena_id = a.arena_id
        JOIN cities c ON t.city_id = c.city_id
        JOIN states s ON c.state_id = s.state_id
        JOIN countries cout ON s.country_id = cout.country_id
        WHERE cout.country_id = ?
        LIMIT ? OFFSET ?
    """
    params = (query, per_page, (page - 1) * per_page)

    cursor.execute(sql_query, params)
    country_teams = cursor.fetchall()

    sql_query = """
        SELECT COUNT(*)
        FROM teams t
        JOIN arenas a ON t.arena_id = a.arena_id
        JOIN cities c ON t.city_id = c.city_id
        JOIN states s ON c.state_id = s.state_id
        JOIN countries cout ON s.country_id = cout.country_id
        WHERE cout.country_id = ?
    """

    cursor.execute(sql_query, (query,))
    total_count = cursor.fetchone()[0]

    return country_teams, total_count
