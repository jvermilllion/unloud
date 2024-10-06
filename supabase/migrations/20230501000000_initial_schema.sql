-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Existing tables (artists, albums, tracks, playlists, playlist_tracks, favorites, user_preferences, comments, user_follows, artist_follows, listening_history) remain the same

-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create waveform_comments table
CREATE TABLE waveform_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  timestamp FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audio_analysis table
CREATE TABLE audio_analysis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  bpm FLOAT,
  key TEXT,
  energy FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(track_id)
);

-- Create playlist_collaborators table
CREATE TABLE playlist_collaborators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(playlist_id, user_id)
);

-- Create track_versions table
CREATE TABLE track_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  original_track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  version_name TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create genres table
CREATE TABLE genres (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alter existing tables to use genre_id
ALTER TABLE artists ADD COLUMN genre_id UUID REFERENCES genres(id) ON DELETE SET NULL;
ALTER TABLE tracks ADD COLUMN genre_id UUID REFERENCES genres(id) ON DELETE SET NULL;

-- Create lyrics table
CREATE TABLE lyrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(track_id)
);

-- Create user_activity table
CREATE TABLE user_activity (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create error_logs table
CREATE TABLE error_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add order column to playlist_tracks
ALTER TABLE playlist_tracks ADD COLUMN track_order INTEGER NOT NULL DEFAULT 0;

-- Create new indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_waveform_comments_track_id ON waveform_comments(track_id);
CREATE INDEX idx_audio_analysis_track_id ON audio_analysis(track_id);
CREATE INDEX idx_playlist_collaborators_playlist_id ON playlist_collaborators(playlist_id);
CREATE INDEX idx_playlist_collaborators_user_id ON playlist_collaborators(user_id);
CREATE INDEX idx_track_versions_original_track_id ON track_versions(original_track_id);
CREATE INDEX idx_artists_genre_id ON artists(genre_id);
CREATE INDEX idx_tracks_genre_id ON tracks(genre_id);
CREATE INDEX idx_lyrics_track_id ON lyrics(track_id);
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_created_at ON user_activity(created_at);
CREATE INDEX idx_error_logs_created_at ON error_logs(created_at);

-- Add triggers for new tables
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_waveform_comments_updated_at
BEFORE UPDATE ON waveform_comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_audio_analysis_updated_at
BEFORE UPDATE ON audio_analysis
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_track_versions_updated_at
BEFORE UPDATE ON track_versions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_lyrics_updated_at
BEFORE UPDATE ON lyrics
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Existing functions and triggers remain the same