-- Rename the existing table
ALTER TABLE quotes RENAME TO quotes_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS quotes (
    quote_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER,
    quote TEXT CHECK (length(trim(quote)) > 0), -- Ensure the quote is not empty
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO quotes (quote_id, player_id, quote)
SELECT
    quote_id,
    player_id,
    quote
FROM quotes_old
WHERE length(trim(quote)) > 0;

-- Drop the old table
DROP TABLE quotes_old;
