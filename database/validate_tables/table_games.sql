-- Rename the existing table
ALTER TABLE games RENAME TO games_old;

-- Create the new table with the same structure
CREATE TABLE IF NOT EXISTS games (
    game_id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE,
    home_team_id INTEGER,
    away_team_id INTEGER,
    official_id INTEGER,

    FOREIGN KEY (home_team_id) REFERENCES teams(team_id) 
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    FOREIGN KEY (away_team_id) REFERENCES teams(team_id) 
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    FOREIGN KEY (official_id) REFERENCES officials(official_id) 
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO games (game_id, date, home_team_id, away_team_id, official_id)
SELECT
    game_id,
    date,
    home_team_id,
    away_team_id,
    official_id
FROM games_old;

-- Drop the old table
DROP TABLE games_old;
