CREATE TABLE IF NOT EXISTS admins (
    admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(30) UNIQUE 
        CHECK(
            -- Ensure the username doesn't contain periods at the start, end, or within the name
            username NOT LIKE '%.%' AND
            username NOT LIKE '.%' AND
            username NOT LIKE '%.' AND
            username NOT LIKE '% %' AND
            -- Allow only alphanumeric, period, and underscore characters
            username GLOB '[A-Za-z0-9._]*' AND
            -- Ensure the username length is between 3 and 30 characters
            LENGTH(username) >= 3 AND 
            LENGTH(username) <= 30
        ),
    mail VARCHAR(30) UNIQUE 
        CHECK(
            -- Ensure the email contains "@" and a domain part
            mail LIKE '%@%.%' AND
            -- Ensure the email length is at least 7 characters
            LENGTH(mail) >= 7 AND
            -- Disallow multiple "@" symbols and consecutive periods
            mail NOT LIKE '%@%@%' AND
            mail NOT LIKE '%..%' AND
            mail NOT LIKE '%.@%' AND
            mail NOT LIKE '%@.%'
        ),
    password_hash VARCHAR(60) NOT NULL
        CHECK(LENGTH(password_hash) = 60), -- Ensure password hash length is exactly 60 characters
    last_login DATE DEFAULT (CURRENT_TIMESTAMP),
    creation_date DATE DEFAULT (CURRENT_TIMESTAMP)
);
