# data_fetch.py
import os
from .db_utils import get_db_connection
import sqlite3
import random


# Function to load and execute a query from a specified SQL file
def fetch_from_sql_file(filename):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Construct the full file path and load the SQL query from the file
    sql_file_path = os.path.join("../database/queries", filename)
    with open(sql_file_path, "r") as file:
        query = file.read()

    # Execute the query and fetch results
    cursor.execute(query)
    results = cursor.fetchall()
    conn.close()

    return results


def get_countries(query=None, page=1, per_page=24):
    conn = get_db_connection()
    cursor = conn.cursor()

    base_query = """
        WITH teamsWithCountry AS (
            SELECT
                t.team_id,
                co.country_id
            FROM
                teams t
            JOIN
                cities ci ON t.city_id = ci.city_id
            JOIN
                states st ON ci.state_id = st.state_id
            JOIN
                countries co ON st.country_id = co.country_id
        ),
        playerWithCountry AS (
            SELECT
                p.player_id,
                co.country_id
            FROM
                players p
            JOIN
                countries co ON p.country_id = co.country_id
        )
        SELECT
            c.country_id,
            c.name,
            c.flag_link,
            COALESCE(team_counts.team_count, 0) AS team_count,
            COALESCE(player_counts.player_count, 0) AS player_count
        FROM
            countries c
        LEFT JOIN (
            SELECT
                country_id,
                COUNT(team_id) AS team_count
            FROM
                teamsWithCountry
            GROUP BY country_id
        ) team_counts ON c.country_id = team_counts.country_id
        LEFT JOIN (
            SELECT
                country_id,
                COUNT(player_id) AS player_count
            FROM
                playerWithCountry
            GROUP BY country_id
        ) player_counts ON c.country_id = player_counts.country_id
        WHERE
            COALESCE(team_counts.team_count, 0) > 0 OR
            COALESCE(player_counts.player_count, 0) > 0
    """

    if query:
        base_query += " AND c.name LIKE ?"
        params = (f"{query}%",)
    else:
        params = ()

    # Add pagination
    base_query += " LIMIT ? OFFSET ?"
    params += (per_page, (page - 1) * per_page)

    cursor.execute(base_query, params)
    countries = cursor.fetchall()

    # Get total count for pagination
    count_query = """
        WITH teamsWithCountry AS (
            SELECT
                t.team_id,
                co.country_id
            FROM
                teams t
            JOIN
                cities ci ON t.city_id = ci.city_id
            JOIN
                states st ON ci.state_id = st.state_id
            JOIN
                countries co ON st.country_id = co.country_id
        ),
        playerWithCountry AS (
            SELECT
                p.player_id,
                co.country_id
            FROM
                players p
            JOIN
                countries co ON p.country_id = co.country_id
        )
        SELECT COUNT(*)
        FROM
            countries c
        LEFT JOIN (
            SELECT
                country_id,
                COUNT(team_id) AS team_count
            FROM
                teamsWithCountry
            GROUP BY country_id
        ) team_counts ON c.country_id = team_counts.country_id
        LEFT JOIN (
            SELECT
                country_id,
                COUNT(player_id) AS player_count
            FROM
                playerWithCountry
            GROUP BY country_id
        ) player_counts ON c.country_id = player_counts.country_id
        WHERE
            COALESCE(team_counts.team_count, 0) > 0 OR
            COALESCE(player_counts.player_count, 0) > 0
    """

    if query:
        count_query += " AND c.name LIKE ?"
        cursor.execute(count_query, (f"{query}%",))
    else:
        cursor.execute(count_query)

    total_count = cursor.fetchone()[0]

    conn.close()
    return countries, total_count


def get_teams(query=None, page=1, per_page=24):
    conn = get_db_connection()
    cursor = conn.cursor()

    if query:
        sql_query = """
            SELECT
                team_id,
                abbreviation,
                nickname,
                logo_url
            FROM
                teams
            WHERE
                nickname LIKE ?
            LIMIT ? OFFSET ?
        """
        params = (f"{query}%", per_page, (page - 1) * per_page)
    else:
        sql_query = """
            SELECT
                team_id,
                abbreviation,
                nickname,
                logo_url
            FROM
                teams
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


def get_players(query=None, active=0, page=1, per_page=24):
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = """
        SELECT
            p.player_id,
            p.first_name,
            p.last_name,
            p.height,
            p.weight,
            p.birth_date,
            p.college,
            p.country_id,
            p.png_name,
            pi.is_active
        FROM
            players p
        LEFT JOIN
            player_infos pi ON p.player_id = pi.player_id
    """
    if active:
        sql_query += "WHERE pi.is_active = 1"
    if query:
        if active:
            sql_query += " AND (p.first_name LIKE ? OR p.last_name LIKE ?)\n"
        else:
            sql_query += "WHERE p.first_name LIKE ? OR p.last_name LIKE ?\n"

    # ORDER BY p.png_name DESC
    sql_query += """
        LIMIT ? OFFSET ?
    """

    if query:
        params = (f"{query}%", f"{query}%", per_page, (page - 1) * per_page)
    else:
        params = (per_page, (page - 1) * per_page)

    cursor.execute(sql_query, params)
    players = cursor.fetchall()

    count_query = """
        SELECT COUNT(*)
        FROM players p
        LEFT JOIN
            player_infos pi ON p.player_id = pi.player_id
    """

    if active:
        count_query += "WHERE pi.is_active = 1"
    if query:
        if active:
            count_query += " AND (p.first_name LIKE ? OR p.last_name LIKE ?)\n"
        else:
            count_query += "WHERE p.first_name LIKE ? OR p.last_name LIKE ?\n"

    # count query
    if query:
        count_params = (f"{query}%", f"{query}%")
    else:
        count_params = ()

    cursor.execute(count_query, count_params)
    total_count = cursor.fetchone()[0]

    conn.close()
    return players, total_count


def get_games(
    team_nickname=None,
    start_date=None,
    end_date=None,
    official_name=None,
    page=1,
    per_page=10,
):
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
        FROM
            games g
        LEFT JOIN
            teams t1 ON g.home_team_id = t1.team_id
        LEFT JOIN
            teams t2 ON g.away_team_id = t2.team_id
        LEFT JOIN
            officials o ON g.official_id = o.official_id
        LEFT JOIN
            game_stats gs ON g.game_id = gs.game_id
        WHERE 1 = 1
    """

    # Add filters dynamically based on provided parameters
    params = []

    # Filter by team nickname
    if team_nickname:
        sql_query += " AND (t1.nickname = ? OR t2.nickname = ?)"
        params.extend([team_nickname, team_nickname])

    # Filter by start date
    if start_date:
        sql_query += " AND g.date >= ?"
        params.append(start_date)

    # Filter by end date
    if end_date:
        sql_query += " AND g.date <= ?"
        params.append(end_date)

    # Filter by official name
    if official_name:
        sql_query += " AND (o.first_name || ' ' || o.last_name) LIKE ?"
        params.append(f"%{official_name}%")

    # Add pagination
    sql_query += """
        ORDER BY g.date DESC
        LIMIT ? OFFSET ?
    """
    params.extend([per_page, (page - 1) * per_page])

    # Execute the query
    cursor.execute(sql_query, params)
    games = cursor.fetchall()

    # Count total games for the filters
    count_query = """
        SELECT COUNT(*)
        FROM
            games g
        LEFT
            JOIN teams t1 ON g.home_team_id = t1.team_id
        LEFT
            JOIN teams t2 ON g.away_team_id = t2.team_id
        LEFT
            JOIN officials o ON g.official_id = o.official_id
        WHERE 1 = 1
    """
    count_params = []

    # Count filter by team nickname
    if team_nickname:
        count_query += " AND (t1.nickname = ? OR t2.nickname = ?)"
        count_params.extend([team_nickname, team_nickname])

    # Count filter by start date
    if start_date:
        count_query += " AND g.date >= ?"
        count_params.append(start_date)

    # Count filter by end date
    if end_date:
        count_query += " AND g.date <= ?"
        count_params.append(end_date)

    # Count filter by official name
    if official_name:
        count_query += " AND (o.first_name || ' ' || o.last_name) LIKE ?"
        count_params.append(f"%{official_name}%")

    cursor.execute(count_query, count_params)
    total_count = cursor.fetchone()[0]

    conn.close()
    return games, total_count


def get_playerInfo(playerid):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
    SELECT
        COALESCE(p.first_name, 'Unknown') AS first_name,
        COALESCE(p.last_name, 'Unknown') AS last_name,
        COALESCE(p.height, 'Unknown') AS height,
        COALESCE(p.weight, 'Unknown') AS weight,
        COALESCE(p.birth_date, 'Unknown') AS birth_date,
        COALESCE(p.college, 'Unknown') AS college,
        COALESCE(c.name, 'Unknown') AS country_name,
        COALESCE(c.flag_link, 'Unknown') AS country_flag,
        COALESCE(p.png_name, 'Unknown') AS player_img,
        COALESCE(active_team.team_id, 'Unknown') AS active_team_id,
        COALESCE(active_team.name, 'Unknown') AS active_team_name,
        COALESCE(active_team.logo_url, 'Unknown') AS active_team_logo,
        COALESCE(drafted_team.team_id, 'Unknown') AS drafted_team_id,
        COALESCE(drafted_team.name, 'Unknown') AS drafted_team_name,
        COALESCE(drafted_team.logo_url, 'Unknown') AS drafted_team_logo,
        COALESCE(pi.is_active, 'Unknown') AS active_player,
        COALESCE(pi.position, 'Unknown') AS position,
        COALESCE(pi.from_year, 'Unknown') AS start_year,
        COALESCE(pi.to_year, 'Unknown') AS end_year,
        COALESCE(pi.jersey, 'Unknown') AS jersey_number,
        COALESCE(d.season, 'Unknown') AS draft_year,
        COALESCE(d.overall_pick, 'Unknown') AS overall_pick,
        COALESCE(p.country_id, 'Unknown') AS country_id,
        COALESCE(pi.team_id, 'Unknown') AS team_id
    FROM
        players p
    LEFT JOIN
        player_infos pi ON p.player_id = pi.player_id
    LEFT JOIN
        drafts d ON p.player_id = d.player_id
    LEFT JOIN
        teams active_team ON pi.team_id = active_team.team_id AND pi.is_active = 1
    LEFT JOIN
        teams drafted_team ON d.team_id = drafted_team.team_id
    LEFT JOIN
        countries c ON p.country_id = c.country_id
    WHERE
        p.player_id = ?;
    """
    cursor.execute(query, (playerid,))
    playerinfos = cursor.fetchone()
    conn.close()
    return playerinfos


def get_gameInfo(gameid):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
    SELECT
        COALESCE(g.game_id, 'Unknown') AS game_id,
        COALESCE(g.date, 'Unknown') AS date,
        COALESCE(g.home_team_id, 'Unknown') AS home_team_id,
        COALESCE(t1.name, 'Unknown') AS home_team_name,
        COALESCE(g.away_team_id, 'Unknown') AS away_team_id,
        COALESCE(t2.name, 'Unknown') AS away_team_name,
        COALESCE(o.first_name || ' ' || o.last_name, 'Unknown') AS official_name,
        COALESCE(gs.season, 'Unknown') AS season,
        COALESCE(gs.home_team_score, 'Unknown') AS home_team_score,
        COALESCE(gs.away_team_score, 'Unknown') AS away_team_score,
        COALESCE(gs.home_qtr1_points, 'Unknown') AS home_qtr1_points,
        COALESCE(gs.home_qtr2_points, 'Unknown') AS home_qtr2_points,
        COALESCE(gs.home_qtr3_points, 'Unknown') AS home_qtr3_points,
        COALESCE(gs.home_qtr4_points, 'Unknown') AS home_qtr4_points,
        COALESCE(gs.away_qtr1_points, 'Unknown') AS away_qtr1_points,
        COALESCE(gs.away_qtr2_points, 'Unknown') AS away_qtr2_points,
        COALESCE(gs.away_qtr3_points, 'Unknown') AS away_qtr3_points,
        COALESCE(gs.away_qtr4_points, 'Unknown') AS away_qtr4_points,
        COALESCE(gs.home_rebounds, 'Unknown') AS home_rebounds,
        COALESCE(gs.home_blocks, 'Unknown') AS home_blocks,
        COALESCE(gs.home_steals, 'Unknown') AS home_steals,
        COALESCE(gs.away_rebounds, 'Unknown') AS away_rebounds,
        COALESCE(gs.away_blocks, 'Unknown') AS away_blocks,
        COALESCE(gs.away_steals, 'Unknown') AS away_steals,
        COALESCE(t1.logo_url, 'Unknown') AS home_team_logo,
        COALESCE(t2.logo_url, 'Unknown') AS away_team_logo
    FROM
        games g
    LEFT JOIN
        game_stats gs ON g.game_id = gs.game_id
    LEFT JOIN
        teams t1 ON g.home_team_id = t1.team_id
    LEFT JOIN
        teams t2 ON g.away_team_id = t2.team_id
    LEFT JOIN
        officials o ON g.official_id = o.official_id
    WHERE
        g.game_id = ?;
    """
    cursor.execute(query, (gameid,))
    gameinfos = cursor.fetchone()
    conn.close()
    return gameinfos


def get_countryInfo(country_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
        WITH teamsWithCountry AS (
            SELECT
                t.team_id,
                co.country_id
            FROM
                teams t
            JOIN
                cities ci ON t.city_id = ci.city_id
            JOIN
                states st ON ci.state_id = st.state_id
            JOIN
                countries co ON st.country_id = co.country_id
        ),
        playerWithCountry AS (
            SELECT
                p.player_id,
                co.country_id
            FROM
                players p
            JOIN
                countries co ON p.country_id = co.country_id
        )
        SELECT
            COALESCE(c.country_id, 'Unknown') AS country_id,
            COALESCE(c.name, 'Unknown') AS country_name,
            COALESCE(c.flag_link, 'Unknown') AS flag_link,
            COALESCE(COUNT(DISTINCT p.player_id), 0) AS player_count,
            COALESCE(COUNT(DISTINCT t.team_id), 0) AS team_count
        FROM
            countries c
        LEFT
            JOIN playerWithCountry p ON c.country_id = p.country_id
        LEFT
            JOIN teamsWithCountry t ON c.country_id = t.country_id
        WHERE
            c.country_id = ?
        GROUP BY c.country_id, c.name, c.flag_link
    """

    cursor.execute(query, (country_id,))
    country_info = cursor.fetchone()
    conn.close()
    return country_info


def get_numberOfTeamsInCountry():
    team_number_in_country = fetch_from_sql_file("team_number_in_country.sql")
    return team_number_in_country


def get_numberOfPlayersInCountry():
    player_number_in_country = fetch_from_sql_file(
        "player_number_in_country.sql")
    return player_number_in_country


def getLastGames(limit=5, team_id=None):
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

    sql_query = f"""
        SELECT
            p.player_id,
            p.first_name,
            p.last_name,
            p.height,
            p.weight,
            p.birth_date,
            p.college
        FROM players p
        NATURAL JOIN countries c
        {query_to_sql(query)}
        LIMIT ? OFFSET ?
    """
    params = (per_page, (page - 1) * per_page)

    cursor.execute(sql_query, params)
    country_players = cursor.fetchall()

    sql_query = f"""
        SELECT COUNT(*)
        FROM players p
        NATURAL JOIN countries c
        {query_to_sql(query)}
    """

    cursor.execute(sql_query)
    total_count = cursor.fetchone()[0]

    return country_players, total_count


def get_countryTeams(query, page=1, per_page=24):
    conn = get_db_connection()
    cursor = conn.cursor()

    key_mapping = {
        "name": "t.name",
        "city_name": "c.name",
        "arena_name": "a.name"
    }

    filters = query.get("filters", {})
    for old_key, new_key in key_mapping.items():
        if old_key in filters:
            filters[new_key] = filters.pop(old_key)

    for sort in query.get("sorts", []):
        for old_key, new_key in key_mapping.items():
            if old_key in sort:
                sort[new_key] = sort.pop(old_key)

    sql_query = f"""
        SELECT
            t.team_id,
            t.name,
            t.owner,
            t.general_manager,
            t.headcoach,
            c.name as city_name,
            a.name as arena_name,
            t.year_founded
        FROM teams t
        JOIN arenas a ON t.arena_id = a.arena_id
        JOIN cities c ON t.city_id = c.city_id
        JOIN states s ON c.state_id = s.state_id
        JOIN countries cout ON s.country_id = cout.country_id
        {query_to_sql(query)}
        LIMIT ? OFFSET ?
    """
    params = (per_page, (page - 1) * per_page)

    cursor.execute(sql_query, params)
    country_teams = cursor.fetchall()

    sql_query = f"""
        SELECT COUNT(*)
        FROM
            teams t
        JOIN
            arenas a ON t.arena_id = a.arena_id
        JOIN
            cities c ON t.city_id = c.city_id
        JOIN
            states s ON c.state_id = s.state_id
        JOIN
            countries cout ON s.country_id = cout.country_id
        {query_to_sql(query)}
    """

    cursor.execute(sql_query)
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


def get_random_quote():
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    SELECT q.*,
        p.first_name || " " || p.last_name AS player_name,
        p.png_name AS png_name
    FROM
        quotes q
    LEFT
        JOIN players p ON p.player_id = q.player_id
    ORDER BY RANDOM()
    LIMIT 1;
    """

    cursor.execute(query)
    quote_info = cursor.fetchone()
    conn.close()
    return quote_info


def teams_win_rate(year, team_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    SELECT
        t.team_id,
        t.name,
        CAST(SUM(CASE
            WHEN (gs.home_team_score > gs.away_team_score AND t.team_id = g.home_team_id) OR
                 (gs.away_team_score > gs.home_team_score AND t.team_id = g.away_team_id)
            THEN 1
            ELSE 0
        END) AS FLOAT) /
        NULLIF(SUM(CASE
            WHEN gs.home_team_score > gs.away_team_score OR gs.home_team_score < gs.away_team_score
            THEN 1
            ELSE 0
        END), 0) AS win_rate
    FROM
        games g
    LEFT
        JOIN game_stats gs ON g.game_id = gs.game_id
    LEFT
        JOIN teams t ON t.team_id IN (g.home_team_id, g.away_team_id)
    WHERE
        t.name IS NOT NULL AND
        g.date >= ? AND
        t.team_id = ?
    GROUP BY
        t.team_id, t.name;
    """

    # Construct the date parameter
    date_param = f"{year}-01-01 00:00:00"

    # Execute the query with parameters
    cursor.execute(query, (date_param, team_id))
    teams_win_rate = cursor.fetchall()

    # Close the connection
    conn.close()

    # Return formatted results
    return [
        {"team_id": row[0], "team_name": row[1], "win_rate": row[2]}
        for row in teams_win_rate
    ]


def average_roster_age_perTeam():
    average_roster_age = fetch_from_sql_file("average_roster_age.sql")
    return average_roster_age


def get_country_options():
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = """
        SELECT
            country_id,
            name
        FROM
            countries
    """

    cursor.execute(sql_query)
    country_options = cursor.fetchall()

    conn.close()
    return country_options


def get_city_options():
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = """
        SELECT
            city_id,
            name
        FROM
            cities
    """

    cursor.execute(sql_query)
    city_options = cursor.fetchall()

    conn.close()
    return city_options


def get_arena_options():
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = """
        SELECT
            arena_id,
            name
        FROM
            arenas
    """

    cursor.execute(sql_query)
    arena_options = cursor.fetchall()

    conn.close()
    return arena_options


def get_official_options():
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = """
        SELECT
            official_id,
            first_name || ' ' || last_name AS official_name
        FROM
            officials
    """

    cursor.execute(sql_query)
    official_options = cursor.fetchall()

    conn.close()
    return official_options


def get_team_options():
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = """
        SELECT
            team_id,
            nickname
        FROM
            teams
    """

    cursor.execute(sql_query)
    team_options = cursor.fetchall()

    conn.close()
    return team_options


def get_admin(username):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    SELECT
       username,
       password_hash
    FROM
        admins
    WHERE
        username = ?
    """

    cursor.execute(query, (username,))
    admin_info = cursor.fetchone()

    conn.close()
    return admin_info


def get_adminTeams(query, page=1, per_page=24):
    conn = get_db_connection()
    cursor = conn.cursor()

    key_mapping = {
        "name": "t.name",
        "abbreviation": "t.abbreviation",
        "team_name": "t.name",
        "city_name": "c.name",
        "arena_name": "a.name"
    }

    filters = query.get("filters", {})
    for old_key, new_key in key_mapping.items():
        if old_key in filters:
            filters[new_key] = filters.pop(old_key)

    for sort in query.get("sorts", []):
        for old_key, new_key in key_mapping.items():
            if old_key in sort:
                sort[new_key] = sort.pop(old_key)

    sql_query = f"""
        SELECT
            t.team_id,
            t.name,
            t.nickname,
            t.abbreviation,
            t.owner,
            t.general_manager,
            t.headcoach,
            c.name as city_name,
            c.city_id,
            a.name as arena_name,
            a.arena_id,
            t.year_founded,
            t.facebook,
            t.instagram,
            t.twitter,
            t.logo_url
        FROM
            teams t
        JOIN
            arenas a ON t.arena_id = a.arena_id
        JOIN
            cities c ON t.city_id = c.city_id
        {query_to_sql(query)}
        LIMIT ? OFFSET ?
    """
    params = (per_page, (page - 1) * per_page)

    cursor.execute(sql_query, params)
    admin_teams = cursor.fetchall()

    sql_query = f"""
        SELECT COUNT(*)
        FROM
            teams t
        JOIN
            arenas a ON t.arena_id = a.arena_id
        JOIN
            cities c ON t.city_id = c.city_id
        JOIN
            states s ON c.state_id = s.state_id
        JOIN
            countries cout ON s.country_id = cout.country_id
        {query_to_sql(query)}
    """

    cursor.execute(sql_query)
    total_count = cursor.fetchone()[0]

    return admin_teams, total_count


def get_adminPlayers(query, page=1, per_page=24):
    conn = get_db_connection()
    cursor = conn.cursor()

    key_mapping = {
        "player_id": "p.player_id",
        "country_name": "c.name",
        "team_name": "t.name"
    }

    filters = query.get("filters", {})
    for old_key, new_key in key_mapping.items():
        if old_key in filters:
            filters[new_key] = filters.pop(old_key)

    for sort in query.get("sorts", []):
        for old_key, new_key in key_mapping.items():
            if old_key in sort:
                sort[new_key] = sort.pop(old_key)

    sql_query = f"""
        SELECT
            p.player_id,
            p.first_name,
            p.last_name,
            p.height,
            p.weight,
            p.birth_date,
            p.college,
            c.name as country_name,
            c.country_id as country_id,
            t.name as team_name,
            t.team_id as team_id,
            pi.is_active,
            pi.position,
            pi.from_year,
            pi.to_year,
            pi.jersey
        FROM
            players p
        LEFT JOIN
            player_infos pi ON p.player_id = pi.player_id
        LEFT JOIN
            teams t ON t.team_id = pi.team_id
        LEFT JOIN
            countries c ON c.country_id = p.country_id
        {query_to_sql(query)}
        LIMIT ? OFFSET ?
    """
    params = (per_page, (page - 1) * per_page)

    cursor.execute(sql_query, params)
    admin_players = cursor.fetchall()

    sql_query = f"""
        SELECT COUNT(*)
        FROM
            players p
        LEFT JOIN
            player_infos pi ON p.player_id = pi.player_id
        LEFT JOIN
            teams t ON t.team_id = pi.team_id
        LEFT JOIN
            countries c ON c.country_id = p.country_id
        {query_to_sql(query)}
    """

    cursor.execute(sql_query)
    total_count = cursor.fetchone()[0]

    return admin_players, total_count


def get_adminGames(query, page=1, per_page=24):
    conn = get_db_connection()
    cursor = conn.cursor()

    key_mapping = {
        "game_id": "g.game_id",
        "home_team_name": "t1.nickname",
        "away_team_name": "t2.nickname",
    }

    filters = query.get("filters", {})
    for old_key, new_key in key_mapping.items():
        if old_key in filters:
            filters[new_key] = filters.pop(old_key)

    for sort in query.get("sorts", []):
        for old_key, new_key in key_mapping.items():
            if old_key in sort:
                sort[new_key] = sort.pop(old_key)

    sql_query = f"""
        SELECT
            g.game_id,
            g.date,
            t1.nickname AS home_team_name,
            t1.team_id AS home_team_id,
            t2.nickname AS away_team_name,
            t2.team_id AS away_team_id,
            o.first_name || ' ' || o.last_name AS official_name,
            o.official_id,
            gs.season,
            gs.home_team_score,
            gs.away_team_score,
            gs.home_qtr1_points,
            gs.home_qtr2_points,
            gs.home_qtr3_points,
            gs.home_qtr4_points,
            gs.away_qtr1_points,
            gs.away_qtr2_points,
            gs.away_qtr3_points,
            gs.away_qtr4_points,
            gs.home_rebounds,
            gs.home_blocks,
            gs.home_steals,
            gs.away_rebounds,
            gs.away_blocks,
            gs.away_steals
        FROM
            games g
        LEFT JOIN
            game_stats gs ON g.game_id = gs.game_id
        LEFT JOIN
            teams t1 ON t1.team_id = g.home_team_id
        LEFT JOIN
            teams t2 ON t2.team_id = g.away_team_id
        LEFT JOIN
            officials o ON o.official_id = g.official_id
        {query_to_sql(query)}
        LIMIT ? OFFSET ?
    """
    params = (per_page, (page - 1) * per_page)

    cursor.execute(sql_query, params)
    admin_games = cursor.fetchall()

    sql_query = f"""
        SELECT COUNT(*), o.first_name || ' ' || o.last_name AS official_name
        FROM
            games g
        LEFT JOIN
            game_stats gs ON g.game_id = gs.game_id
        LEFT JOIN
            teams t1 ON t1.team_id = g.home_team_id
        LEFT JOIN
            teams t2 ON t2.team_id = g.away_team_id
        LEFT JOIN
            officials o ON o.official_id = g.official_id
        {query_to_sql(query)}
    """

    cursor.execute(sql_query)
    total_count = cursor.fetchone()[0]

    return admin_games, total_count


def query_to_sql(query):
    sql = ""

    filters = "WHERE"
    conditions = []

    for key, value in query["filters"].items():
        if isinstance(value, dict) and "constraints" in value:
            operator = value.get("operator", "and").upper()
            constraint_conditions = []

            for constraint in value["constraints"]:
                filterValue = constraint.get("value")
                constraint_operator = constraint.get("operator")
                if filterValue is not None and constraint_operator is not None:
                    constraint_conditions.append(
                        f"{key} {constraint_operator} {filterValue}"
                    )

            if constraint_conditions:
                conditions.append(
                    f" ({f' {operator} '.join(constraint_conditions)}) ")

    if conditions:
        filters += " AND ".join(conditions)
    else:
        filters = filters.rstrip("WHERE")

    sql += filters

    sorts = ", ".join([f"{key} {value}" for sort in query.get("sorts", [])
                       for key, value in sort.items()])
    if sorts:
        sql += f"ORDER BY {sorts}"

    return sql
