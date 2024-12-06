# data_fetch.py
import os
from .db_utils import get_db_connection
import sqlite3
from datetime import datetime

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

def get_players(query=None, page=1, per_page=24):
    conn = get_db_connection()
    cursor = conn.cursor()

    if query:
        sql_query = """
            SELECT player_id, first_name, last_name, height, weight, birth_date, college, country_id, png_name
            FROM players
            WHERE first_name LIKE ? OR last_name LIKE ?
            LIMIT ? OFFSET ?
        """
        params = (f"{query}%", f"{query}%", per_page, (page - 1) * per_page)
    else:
        sql_query = """
            SELECT player_id, first_name, last_name, height, weight, birth_date, college, country_id, png_name
            FROM players
            LIMIT ? OFFSET ?
        """
        params = (per_page, (page - 1) * per_page)

    cursor.execute(sql_query, params)
    players = cursor.fetchall()

    if query:
        count_query = "SELECT COUNT(*) FROM players WHERE first_name LIKE ? OR last_name LIKE ?"
        cursor.execute(count_query, (f"{query}%", f"{query}%"))
    else:
        count_query = "SELECT COUNT(*) FROM players"
        cursor.execute(count_query)

    total_count = cursor.fetchone()[0]

    conn.close()
    return players, total_count

def get_playerInfo(playerid):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
    SELECT
        p.first_name,
        p.last_name,
        p.height,
        p.weight,
        p.birth_date,
        p.college,
        c.name as country_name,
        c.flag_link,
        p.png_name,
        t.name as team_name,
        t.logo_url,
        pi.is_active,
        pi.position,
        pi.from_year,
        pi.to_year,
        pi.jersey,
        d.season,
        d.overall_pick,
        p.country_id,
        pi.team_id
        FROM ((((players p
        INNER JOIN player_infos pi ON p.player_id = pi.player_id)
        LEFT JOIN drafts d ON p.player_id = d.player_id)
        INNER JOIN countries c ON p.country_id = c.country_id)
        INNER JOIN teams t ON pi.team_id = t.team_id)
        WHERE p.player_id = ?;
    """
    cursor.execute(query,(playerid,))
    playerinfos = cursor.fetchone()
    conn.close()
    return playerinfos

def get_numberOfTeamsInCountry():
    team_number_in_country = fetch_from_sql_file("team_number_in_country.sql")
    return team_number_in_country

def get_numberOfPlayersInCountry():
    player_number_in_country = fetch_from_sql_file("player_number_in_country.sql")
    return player_number_in_country

def getLastGames(limit=5, team_id = None):
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
    """
    if team_id:
        sql_query += """
            WHERE t1.team_id = ? OR t2.team_id = ?
        """
        params = (team_id, team_id, limit)
    else:
        params = (limit,)
    sql_query += """
        ORDER BY g.date DESC
        LIMIT ?
    """
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

def get_activeRoster(teamid):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
    SELECT 
        t.name AS team_name,
        p.player_id,
        p.first_name,
        p.last_name,
        p.height,
        p.weight,
        p.birth_date,
        p.college,
        p.png_name,
        pi.jersey,
        pi.position,
        pi.from_year,
        pi.to_year,
        pi.season_exp
    FROM 
        player_infos pi
    JOIN 
        players p ON pi.player_id = p.player_id
    JOIN 
        teams t ON pi.team_id = t.team_id
    WHERE 
        pi.is_active = 1
        AND pi.team_id = ?
    """
    cursor.execute(query, (teamid,))
    roster = cursor.fetchall()
    conn.close()
    return roster

def get_teamInfo(teamid):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
    SELECT 
        t.team_id,
        t.name AS team_name,
        t.abbreviation,
        t.nickname,
        t.year_founded,
        t.owner,
        t.general_manager,
        t.headcoach,
        t.dleague_affiliation,
        t.facebook,
        t.instagram,
        t.twitter,
        t.logo_url,
        c.name AS city_name,
        c.abbreviation AS city_abbreviation,
        c.coordinate_x,
        c.coordinate_y,
        s.name AS state_name,
        a.name AS arena_name,
        a.capacity AS arena_capacity
    FROM 
        teams t
    LEFT JOIN 
        cities c ON t.city_id = c.city_id
    LEFT JOIN 
        states s ON c.state_id = s.state_id
    LEFT JOIN 
        arenas a ON t.arena_id = a.arena_id
    WHERE 
        t.team_id = ?
    """
    cursor.execute(query, (teamid,))
    team_info = cursor.fetchone()
    conn.close()
    return team_info

def get_userInfo(username, hashPassword):
    conn = get_db_connection()
    cursor = conn.cursor()

    query="""
    SELECT * FROM users
    WHERE user_name = ? AND password = ?;
    """

    cursor.execute(query, (username, hashPassword,))
    user_info = cursor.fetchone()
    conn.close()
    return user_info

def update_last_login_of_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    current_date = datetime.now()
    formatted_date = current_date.strftime('%Y-%m-%d')
    query="""
    UPDATE users
    SET last_login = ?
    WHERE user_id = ?
    """

    cursor.execute(query, (formatted_date, user_id,))
    conn.close()
