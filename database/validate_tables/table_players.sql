-- Rename the existing table
ALTER TABLE players RENAME TO players_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS players (
    player_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR NOT NULL CHECK (length(trim(first_name)) > 0),
    last_name VARCHAR NOT NULL CHECK (length(trim(last_name)) > 0),
    height INTEGER CHECK (height >= 0),
    weight INTEGER CHECK (weight >= 0),
    birth_date TIMESTAMP CHECK (birth_date > '1900-01-01'),
    college VARCHAR,
    country_id INTEGER,
    png_name TEXT NOT NULL DEFAULT '',

    FOREIGN KEY (country_id) REFERENCES countries(country_id) ON DELETE SET NULL
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO players (player_id, first_name, last_name, height, weight, birth_date, college, country_id, png_name)
SELECT
    player_id,
    first_name,
    last_name,
    CASE WHEN height > 0 THEN CAST(height AS INTEGER) ELSE NULL END,
    CASE WHEN weight > 0 THEN CAST(weight AS INTEGER) ELSE NULL END,
    birth_date,
    college,
    country_id,
    png_name
FROM players_old
WHERE
    length(trim(first_name)) > 0 AND
    length(trim(last_name)) > 0 AND
    height > 0 AND
    weight > 0 AND
    birth_date > '1900-01-01';

-- Drop the old table
DROP TABLE players_old;
