CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT UNIQUE CHECK(user_name NOT LIKE '%.%' AND
                                user_name NOT LIKE '.%' AND
                                user_name NOT LIKE '%.' AND
                                user_name NOT LIKE '% %' AND
                                LENGTH(user_name) <= 30 AND
                                user_name GLOB '[A-Za-z0-9._]*'
    ),
    password TEXT,
    mail TEXT UNIQUE CHECK (mail LIKE '%@%.com' AND
                            LENGTH(mail) >= 7
    ),
    is_admin BOOLEAN DEFAULT false,
    last_login DATE DEFAULT CURRENT_DATE,
    creation_date DATE DEFAULT CURRENT_DATE
);

INSERT INTO users (user_name, password, mail, is_admin)
VALUES ('temp_user', 'some_val', 'a@a.com', true);