ATTACH DATABASE '/Users/aliemre2023/Downloads/archive (8)/nba.sqlite' AS nba_original;

CREATE TABLE IF NOT EXISTS player_infos (
    player_id INTEGER,
    team_id INTEGER,
    is_active INTEGER CHECK (is_active IN (0,1)), -- Ensure is_active is either 0 or 1
    position INTEGER CHECK (position > 0), -- Ensure position is a positive number
    from_year INTEGER CHECK (from_year > 1900), -- Ensure from_year is after 1900
    to_year INTEGER CHECK (to_year >= from_year), -- Ensure to_year is greater than or equal to from_year
    jersey INTEGER CHECK (jersey > 0 AND jersey <= 99), -- Ensure jersey is between 1 and 99
    season_exp INTEGER CHECK (season_exp >= 0), -- Ensure season_exp is non-negative

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

INSERT INTO player_infos (player_id, team_id, is_active, position, from_year, to_year, jersey, season_exp)
SELECT
    cpi.person_id,
    cpi.team_id,
    p.is_active,
    cpi.position,
    cpi.from_year,
    cpi.to_year,
    cpi.jersey,
    cpi.season_exp
FROM
    nba_original.common_player_info cpi
JOIN
    nba_original.player p
ON
    cpi.person_id = p.id;

DETACH DATABASE nba_original;
