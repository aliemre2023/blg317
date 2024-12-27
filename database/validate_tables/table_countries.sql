-- Rename the existing table
ALTER TABLE countries RENAME TO countries_old;

-- Create the new table with the unique abbreviation constraint
CREATE TABLE IF NOT EXISTS countries (
    country_id INT PRIMARY KEY,
    name VARCHAR(100),
    abbreviation VARCHAR(10) UNIQUE, 
    flag_link VARCHAR(255)
);

-- Insert data from the old table to the new table, handling potential duplicate abbreviations
INSERT INTO countries (country_id, name, abbreviation, flag_link)
SELECT country_id, name, abbreviation, flag_link
FROM countries_old
WHERE abbreviation NOT IN (
    SELECT abbreviation FROM countries -- Exclude rows with duplicate abbreviations
);

-- Drop the old table
DROP TABLE countries_old;
