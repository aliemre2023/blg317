-- Rename the existing table
ALTER TABLE admins RENAME TO admins_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS admins (
    admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(30) UNIQUE 
        CHECK(
            username NOT LIKE '%.%' AND 
            username NOT LIKE '.%' AND 
            username NOT LIKE '%.' AND 
            username NOT LIKE '% %' AND 
            username GLOB '[A-Za-z0-9._]*' AND 
            LENGTH(username) >= 3 AND 
            LENGTH(username) <= 30
        ),
    mail VARCHAR(30) UNIQUE 
        CHECK(
            mail LIKE '%@%.%' AND 
            LENGTH(mail) >= 7 AND 
            mail NOT LIKE '%@%@%' AND 
            mail NOT LIKE '%..%' AND 
            mail NOT LIKE '%.@%' AND 
            mail NOT LIKE '%@.%'
        ),
    password_hash VARCHAR(60) NOT NULL 
        CHECK(LENGTH(password_hash) = 60),
    last_login DATE DEFAULT (CURRENT_TIMESTAMP),
    creation_date DATE DEFAULT (CURRENT_TIMESTAMP)
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO admins (admin_id, username, mail, password_hash)
SELECT admin_id, username, mail, password_hash
FROM admins_old
WHERE 
    username NOT LIKE '%.%' AND 
    username NOT LIKE '.%' AND 
    username NOT LIKE '%.' AND 
    username NOT LIKE '% %' AND 
    username GLOB '[A-Za-z0-9._]*' AND 
    LENGTH(username) >= 3 AND 
    LENGTH(username) <= 30 AND
    mail LIKE '%@%.%' AND 
    LENGTH(mail) >= 7 AND 
    mail NOT LIKE '%@%@%' AND 
    mail NOT LIKE '%..%' AND 
    mail NOT LIKE '%.@%' AND 
    mail NOT LIKE '%@.%' AND
    LENGTH(password_hash) = 60;

-- Drop the old table 
DROP TABLE admins_old;
