-- Rename the existing table
ALTER TABLE states RENAME TO states_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS states (
    state_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR NOT NULL CHECK (length(trim(name)) > 0), -- Ensure state name is not empty 
    country_id INTEGER,

    FOREIGN KEY (country_id) REFERENCES countries(country_id) ON DELETE CASCADE
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO states (state_id, name, country_id)
SELECT 
    state_id, 
    name, 
    country_id 
FROM states_old
WHERE length(trim(name)) > 0; 

-- Drop the old table
DROP TABLE states_old;
