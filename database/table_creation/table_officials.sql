CREATE TABLE IF NOT EXISTS officials(
    official_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR,
    last_name VARCHAR,
    jersey_num  INTEGER
);



ATTACH DATABASE '/Users/kickm/Downloads/archive/nba.sqlite' AS nba_original;

INSERT INTO officials (official_id, first_name, last_name, jersey_num)
SELECT
    official_id,
    first_name,
    last_name,
    MIN(jersey_num) AS jersey_num
FROM
    nba_original.officials
GROUP BY
    official_id, first_name, last_name;
DETACH  DATABASE nba_original;
