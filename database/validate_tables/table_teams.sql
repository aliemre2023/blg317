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

    FOREIGN KEY (city_id) REFERENCES cities(city_id),
    FOREIGN KEY (arena_id) REFERENCES arenas(arena_id)
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


INSERT INTO teams (
     abbreviation, nickname, name, year_founded, city_id, arena_id, owner, 
    general_manager, headcoach, dleague_affiliation, facebook, instagram, twitter, logo_url
)
VALUES (
              -- team_id (unique identifier for the team)
    'LAL',             -- abbreviation (e.g., 3-letter abbreviation)
    'Lakers',          -- nickname (team's nickname)
    'Los Angeles Lakers', -- name (full name of the team)
    1947,              -- year_founded (year the team was founded)
    10,                -- city_id (ID referencing the city where the team is located)
    20,                -- arena_id (ID referencing the arena where the team plays)
    'Jeanie Buss',     -- owner (owner of the team)
    'Rob Pelinka',     -- general_manager (GM of the team)
    'Darvin Ham',      -- headcoach (head coach of the team)
    'South Bay Lakers', -- dleague_affiliation (development league affiliate)
    'https://facebook.com/Lakers', -- facebook (team's Facebook URL)
    'https://instagram.com/Lakers', -- instagram (team's Instagram URL)
    'https://twitter.com/Lakers',   -- twitter (team's Twitter URL)
    'https://example.com/lakers_logo.png' -- logo_url (URL to the team's logo)
);
