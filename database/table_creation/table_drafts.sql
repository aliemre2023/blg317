ATTACH DATABASE '/Users/aliemre2023/Downloads/archive (8)/nba.sqlite' AS nba_original;

CREATE TABLE IF NOT EXISTS drafts (
    draft_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER,
    team_id INTEGER,
    season INTEGER CHECK (season >= 1900 AND season <= strftime('%Y', 'now')),  -- Valid season years
    overall_pick INTEGER CHECK (overall_pick > 0),  -- Ensure overall pick is positive
    position VARCHAR CHECK (position IN ('PG', 'SG', 'SF', 'PF', 'C')),  -- Validate position

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);


INSERT INTO drafts (player_id, team_id, season, overall_pick, position)
SELECT
    dcs.player_id,
    dh.team_id,
    dh.season,
    dh.overall_pick,
    dcs.position

FROM
    nba_original.draft_history dh
JOIN
    nba_original.draft_combine_stats dcs ON dh.person_id = dcs.player_id
JOIN
    players p ON dcs.player_id = p.player_id
JOIN
    teams t ON dh.team_id = t.team_id;

DETACH DATABASE nba_original;