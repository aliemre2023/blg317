SELECT
    p.first_name,
    p.last_name,
    p.height,
    p.weight,
    p.birth_date,
    p.college,
    c.name AS country_name,
    c.flag_link AS country_flag,
    p.png_name AS player_img,
    drafted_team.team_id AS drafted_team_id,
    drafted_team.name AS drafted_team_name,
    drafted_team.logo_url AS drafted_team_logo,
    pi.is_active AS active_player,
    pi.position,
    pi.from_year AS start_year,
    pi.to_year AS end_year,
    pi.jersey AS jersey_number,
    d.season AS draft_year,
    d.overall_pick,
    p.country_id,
    pi.team_id
FROM players p
LEFT JOIN player_infos pi ON p.player_id = pi.player_id
LEFT JOIN drafts d ON p.player_id = d.player_id
LEFT JOIN teams drafted_team ON d.team_id = drafted_team.team_id
LEFT JOIN countries c ON p.country_id = c.country_id
WHERE pi.is_active = 0
  AND d.team_id IS NOT NULL;
