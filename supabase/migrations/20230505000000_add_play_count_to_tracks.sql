-- Add play_count column to tracks table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tracks' AND column_name = 'play_count') THEN
    ALTER TABLE tracks ADD COLUMN play_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Update existing tracks to have a play_count if it's NULL
UPDATE tracks SET play_count = 0 WHERE play_count IS NULL;

-- Add an index on play_count for faster queries
CREATE INDEX IF NOT EXISTS idx_tracks_play_count ON tracks(play_count);