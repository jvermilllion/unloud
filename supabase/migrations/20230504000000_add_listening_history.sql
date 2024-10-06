-- Create listening_history table
CREATE TABLE IF NOT EXISTS listening_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  listened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_listening_history_user_id ON listening_history(user_id);
CREATE INDEX IF NOT EXISTS idx_listening_history_track_id ON listening_history(track_id);
CREATE INDEX IF NOT EXISTS idx_listening_history_listened_at ON listening_history(listened_at);

-- Add a function to record listening history
CREATE OR REPLACE FUNCTION record_listening_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO listening_history (user_id, track_id)
  VALUES (NEW.user_id, NEW.track_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically record listening history when a track is played
CREATE TRIGGER track_played_trigger
AFTER UPDATE OF play_count ON tracks
FOR EACH ROW
WHEN (NEW.play_count > OLD.play_count)
EXECUTE FUNCTION record_listening_history();