SELECT t.team_id AS team_id,
       t.name AS team_name,
       ROUND((
           SELECT AVG(strftime('%Y', '2023-06-12') - strftime('%Y', p.birth_date)) -- last date in the database
           FROM players p
           JOIN player_infos pi ON p.player_id = pi.player_id
           WHERE pi.team_id = t.team_id AND pi.is_active = 1
       ), 2) AS average_roster_age
FROM teams t;