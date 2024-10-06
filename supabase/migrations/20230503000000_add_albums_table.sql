-- Create albums table
CREATE TABLE IF NOT EXISTS albums (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  cover_url TEXT,
  release_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key to tracks table
ALTER TABLE tracks
ADD COLUMN IF NOT EXISTS album_id UUID REFERENCES albums(id) ON DELETE SET NULL;

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_albums_modtime
    BEFORE UPDATE ON albums
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();