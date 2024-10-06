-- Create user_preferences table
CREATE TABLE user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  genres TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create artists table
CREATE TABLE artists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  genre TEXT NOT NULL,
  image_url TEXT,
  popularity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add genre column to tracks table
ALTER TABLE tracks ADD COLUMN genre TEXT;

-- Add play_count column to tracks table
ALTER TABLE tracks ADD COLUMN play_count INTEGER DEFAULT 0;

-- Create trigger to update user_preferences updated_at
CREATE TRIGGER set_user_preferences_updated_at
BEFORE UPDATE ON user_preferences
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Create trigger to update artists updated_at
CREATE TRIGGER set_artists_updated_at
BEFORE UPDATE ON artists
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();