ATTACH DATABASE '/Users/aliemre2023/Downloads/archive (8)/nba.sqlite' AS nba_original;

CREATE TABLE IF NOT EXISTS officials(
    official_id INT PRIMARY KEY CHECK (official_id > 0), -- Ensure official_id is positive
    first_name VARCHAR NOT NULL CHECK (length(trim(first_name)) > 0), -- Ensure first_name is not empty or only spaces
    last_name VARCHAR NOT NULL CHECK (length(trim(last_name)) > 0), -- Ensure last_name is not empty or only spaces
    jersey_num INT CHECK (jersey_num > 0 AND jersey_num <= 99) -- Ensure jersey_num is between 1 and 99
);

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

DETACH DATABASE nba_original;
