-- Rename the existing table
ALTER TABLE arenas RENAME TO arenas_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS arenas (
    arena_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR CHECK(TRIM(name) != '' AND LENGTH(name) <= 100), 
    capacity INTEGER CHECK(capacity >= 0) -- Ensures capacity is non-negative.
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO arenas (arena_id, name, capacity)
SELECT 
    arena_id, 
    name, 
    CASE 
        WHEN capacity > 0 THEN capacity 
        ELSE 0 
    END 
FROM arenas_old
WHERE TRIM(name) != '' AND LENGTH(name) <= 100;

-- Drop the old table
DROP TABLE arenas_old;
