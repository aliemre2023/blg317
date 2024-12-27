-- Rename the existing table
ALTER TABLE game_stats RENAME TO game_stats_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS game_stats (
    game_id INTEGER,
    season INTEGER,
    home_team_score INTEGER CHECK (home_team_score >= 0) DEFAULT 0,
    away_team_score INTEGER CHECK (away_team_score >= 0) DEFAULT 0,
    home_qtr1_points INTEGER CHECK (home_qtr1_points >= 0) DEFAULT 0,
    home_qtr2_points INTEGER CHECK (home_qtr2_points >= 0) DEFAULT 0,
    home_qtr3_points INTEGER CHECK (home_qtr3_points >= 0) DEFAULT 0,
    home_qtr4_points INTEGER CHECK (home_qtr4_points >= 0) DEFAULT 0,
    away_qtr1_points INTEGER CHECK (away_qtr1_points >= 0) DEFAULT 0,
    away_qtr2_points INTEGER CHECK (away_qtr2_points >= 0) DEFAULT 0,
    away_qtr3_points INTEGER CHECK (away_qtr3_points >= 0) DEFAULT 0,
    away_qtr4_points INTEGER CHECK (away_qtr4_points >= 0) DEFAULT 0,
    home_rebounds INTEGER CHECK (home_rebounds >= 0) DEFAULT 0,
    home_blocks INTEGER CHECK (home_blocks >= 0) DEFAULT 0,
    home_steals INTEGER CHECK (home_steals >= 0) DEFAULT 0,
    away_rebounds INTEGER CHECK (away_rebounds >= 0) DEFAULT 0,
    away_blocks INTEGER CHECK (away_blocks >= 0) DEFAULT 0,
    away_steals INTEGER CHECK (away_steals >= 0) DEFAULT 0,

    FOREIGN KEY (game_id) REFERENCES games (game_id)
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO game_stats (game_id, season, home_team_score, away_team_score, home_qtr1_points, home_qtr2_points, home_qtr3_points, home_qtr4_points, 
                       away_qtr1_points, away_qtr2_points, away_qtr3_points, away_qtr4_points, home_rebounds, home_blocks, home_steals, 
                       away_rebounds, away_blocks, away_steals)
SELECT 
    game_id, 
    season, 
    COALESCE(home_team_score, 0), 
    COALESCE(away_team_score, 0), 
    COALESCE(home_qtr1_points, 0), 
    COALESCE(home_qtr2_points, 0), 
    COALESCE(home_qtr3_points, 0), 
    COALESCE(home_qtr4_points, 0), 
    COALESCE(away_qtr1_points, 0), 
    COALESCE(away_qtr2_points, 0), 
    COALESCE(away_qtr3_points, 0), 
    COALESCE(away_qtr4_points, 0), 
    COALESCE(home_rebounds, 0), 
    COALESCE(home_blocks, 0), 
    COALESCE(home_steals, 0), 
    COALESCE(away_rebounds, 0), 
    COALESCE(away_blocks, 0), 
    COALESCE(away_steals, 0) 
FROM game_stats_old
WHERE 
    home_team_score >= 0 AND 
    away_team_score >= 0 AND 
    home_qtr1_points >= 0 AND 
    home_qtr2_points >= 0 AND 
    home_qtr3_points >= 0 AND 
    home_qtr4_points >= 0 AND 
    away_qtr1_points >= 0 AND 
    away_qtr2_points >= 0 AND 
    away_qtr3_points >= 0 AND 
    away_qtr4_points >= 0 AND 
    home_rebounds >= 0 AND 
    home_blocks >= 0 AND 
    home_steals >= 0 AND 
    away_rebounds >= 0 AND 
    away_blocks >= 0 AND 
    away_steals >= 0;

-- Drop the old table
DROP TABLE game_stats_old;
