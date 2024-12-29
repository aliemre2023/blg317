-- Rename the existing table
ALTER TABLE officials RENAME TO officials_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS officials (
    official_id INTEGER PRIMARY KEY AUTOINCREMENT CHECK (official_id > 0), -- Ensure official_id is positive
    first_name VARCHAR NOT NULL CHECK (length(trim(first_name)) > 0), -- Ensure first_name is not empty or only spaces
    last_name VARCHAR NOT NULL CHECK (length(trim(last_name)) > 0), -- Ensure last_name is not empty or only spaces
    jersey_num INTEGER CHECK (jersey_num > 0 AND jersey_num <= 99) -- Ensure jersey_num is between 1 and 99
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO officials (official_id, first_name, last_name, jersey_num)
SELECT
    official_id,
    first_name,
    last_name,
    jersey_num
FROM officials_old
WHERE
    official_id > 0 AND
    length(trim(first_name)) > 0 AND
    length(trim(last_name)) > 0 AND
    jersey_num > 0 AND
    jersey_num <= 99;

-- Drop the old table
DROP TABLE officials_old;
