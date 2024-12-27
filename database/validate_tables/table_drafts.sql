-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS drafts (
    draft_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER,
    team_id INTEGER,
    season INTEGER,
    overall_pick INTEGER CHECK (overall_pick > 0), -- Ensure overall pick is positive
    position VARCHAR CHECK (position IN ('PG', 'SG', 'SF', 'PF', 'C')), -- Validate position

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO drafts (player_id, team_id, season, overall_pick, position)
SELECT
    player_id,
    team_id,
    season, 
    overall_pick,
    position
FROM drafts
WHERE
    overall_pick > 0 AND
    position IN ('PG', 'SG', 'SF', 'PF', 'C');
    