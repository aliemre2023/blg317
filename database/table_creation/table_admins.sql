CREATE TABLE IF NOT EXISTS admins (
    admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(30) UNIQUE CHECK(username NOT LIKE '%.%' AND
                                     username NOT LIKE '.%' AND
                                     username NOT LIKE '%.' AND
                                     username NOT LIKE '% %' AND
                                     username GLOB '[A-Za-z0-9._]*'),
    password_hash VARCHAR(60) NOT NULL,
    last_login DATE DEFAULT (CURRENT_TIMESTAMP),
    creation_date DATE DEFAULT (CURRENT_TIMESTAMP)
);
