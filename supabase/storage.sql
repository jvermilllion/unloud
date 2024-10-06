-- Create buckets
INSERT INTO storage.buckets (id, name) VALUES ('audio', 'audio') ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name) VALUES ('images', 'images') ON CONFLICT DO NOTHING;

-- Set up policies for the audio bucket
CREATE POLICY "Audio files are publicly accessible."
  ON storage.objects FOR SELECT
  USING (bucket_id = 'audio');

CREATE POLICY "Users can upload audio files."
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'audio' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own audio files."
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'audio' AND auth.uid() = owner);

-- Set up policies for the images bucket
CREATE POLICY "Images are publicly accessible."
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "Users can upload images."
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own images."
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'images' AND auth.uid() = owner);