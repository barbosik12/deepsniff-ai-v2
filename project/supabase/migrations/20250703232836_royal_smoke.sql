/*
  # Storage Bucket Configuration for user-uploads

  1. Create bucket 'user-uploads'
  2. Set up RLS policies for authenticated users
  3. Allow users to upload and access their own files
*/

-- Create the user-uploads bucket (run this in Supabase Dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('user-uploads', 'user-uploads', false);

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can upload files to their own folder
CREATE POLICY "Users can upload to own folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'user-uploads' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can view files in their own folder
CREATE POLICY "Users can view own files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'user-uploads' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can update files in their own folder
CREATE POLICY "Users can update own files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'user-uploads' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can delete files in their own folder
CREATE POLICY "Users can delete own files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'user-uploads' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );