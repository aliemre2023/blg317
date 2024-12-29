-- Rename the existing table
ALTER TABLE teams RENAME TO teams_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS teams (
    team_id INTEGER PRIMARY KEY AUTOINCREMENT,
    abbreviation VARCHAR NOT NULL CHECK (length(abbreviation) = 3), -- Ensure abbreviation is 3 characters long
    nickname VARCHAR NOT NULL CHECK (length(trim(nickname)) > 0), -- Ensure nickname is not empty or only spaces
    name TEXT,
    year_founded TIMESTAMP,
    city_id INTEGER,
    arena_id INTEGER,
    owner TEXT,
    general_manager TEXT,
    headcoach TEXT,
    dleague_affiliation TEXT,
    facebook TEXT,
    instagram TEXT,
    twitter TEXT,
    logo_url TEXT,

    FOREIGN KEY (city_id) REFERENCES cities(city_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    FOREIGN KEY (arena_id) REFERENCES arenas(arena_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO teams (team_id, abbreviation, nickname, name, year_founded, city_id, arena_id, owner, general_manager, headcoach, dleague_affiliation, facebook, instagram, twitter, logo_url)
SELECT
    team_id,
    abbreviation,
    nickname,
    name,
    year_founded,
    city_id,
    arena_id,
    owner,
    general_manager,
    headcoach,
    dleague_affiliation,
    facebook,
    instagram,
    twitter,
    logo_url
FROM teams_old
WHERE
    length(abbreviation) = 3 AND
    length(trim(nickname)) > 0;

-- Drop the old table
DROP TABLE teams_old;