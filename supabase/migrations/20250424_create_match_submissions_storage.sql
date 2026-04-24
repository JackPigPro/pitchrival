-- Create storage bucket for match submissions
INSERT INTO storage.buckets (id, name, public)
VALUES ('match-submissions', 'match-submissions', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security for the bucket
CREATE POLICY "Users can upload their own match submissions" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'match-submissions' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()
);

CREATE POLICY "Users can view their own match submissions" ON storage.objects
FOR SELECT USING (
  bucket_id = 'match-submissions' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own match submissions" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'match-submissions' AND
  (storage.foldername(name))[1] = auth.uid()
);

CREATE POLICY "Users can delete their own match submissions" ON storage.objects
FOR DELETE USING (
  bucket_id = 'match-submissions' AND
  (storage.foldername(name))[1] = auth.uid()
);
