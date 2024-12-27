-- Rename the existing table
ALTER TABLE cities RENAME TO cities_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS cities (
    city_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR NOT NULL CHECK(TRIM(name) != '' AND LENGTH(name) <= 100),
    abbreviation VARCHAR NOT NULL CHECK(LENGTH(abbreviation) BETWEEN 2 AND 5),
    state_id INTEGER,
    coordinate_x DOUBLE PRECISION CHECK(coordinate_x BETWEEN -90 AND 90),
    coordinate_y DOUBLE PRECISION CHECK(coordinate_y BETWEEN -180 AND 180),

    FOREIGN KEY (state_id) REFERENCES states(state_id) ON DELETE CASCADE
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO cities (city_id, name, abbreviation, state_id, coordinate_x, coordinate_y)
SELECT
    city_id,
    name,
    abbreviation,
    state_id,
    coordinate_x,
    coordinate_y
FROM cities_old
WHERE
    TRIM(name) != '' AND
    LENGTH(name) <= 100 AND
    LENGTH(abbreviation) BETWEEN 2 AND 5 AND
    coordinate_x BETWEEN -90 AND 90 AND
    coordinate_y BETWEEN -180 AND 180;

-- Drop the old table
DROP TABLE cities_old;
