-- Rename the existing table
ALTER TABLE player_infos RENAME TO player_infos_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS player_infos (
    player_id INTEGER,
    team_id INTEGER,
    is_active INTEGER CHECK (is_active IN (0,1)), 
    position INTEGER, 
    from_year INTEGER CHECK (from_year > 1900),
    to_year INTEGER CHECK (to_year >= from_year),
    jersey INTEGER CHECK (jersey >= 0), -- Ensure jersey is non-negative
    season_exp INTEGER CHECK (season_exp >= 0),

    FOREIGN KEY (player_id) REFERENCES players(player_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO player_infos (player_id, team_id, is_active, position, from_year, to_year, jersey, season_exp)
SELECT 
    player_id, 
    team_id, 
    CASE 
        WHEN is_active IN (0, 1) THEN is_active 
        ELSE NULL 
    END, 
    position, 
    CASE 
        WHEN from_year > 1900 THEN from_year 
        ELSE NULL 
    END, 
    CASE 
        WHEN to_year >= from_year THEN to_year 
        ELSE NULL 
    END, 
    COALESCE(jersey, 0), 
    CASE 
        WHEN season_exp >= 0 THEN season_exp 
        ELSE NULL 
    END
FROM player_infos_old
WHERE 
    is_active IN (0, 1) AND 
    from_year > 1900 AND 
    to_year >= from_year AND 
    season_exp >= 0;

-- Drop the old table
DROP TABLE player_infos_old;
