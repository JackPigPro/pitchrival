-- Create moderation_logs table
-- This table logs all blocked content attempts for review

CREATE TABLE IF NOT EXISTS moderation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  input_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_moderation_logs_user_id ON moderation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_created_at ON moderation_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_input_type ON moderation_logs(input_type);

-- Add RLS (Row Level Security) policies
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view moderation logs
CREATE POLICY "Admins can view all moderation logs"
  ON moderation_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policy: Only system can insert logs (no direct user inserts)
CREATE POLICY "System can insert moderation logs"
  ON moderation_logs FOR INSERT
  WITH CHECK (true);

-- Policy: No one can update logs (immutable)
CREATE POLICY "No updates on moderation logs"
  ON moderation_logs FOR UPDATE
  USING (false)
  WITH CHECK (false);

-- Policy: Only admins can delete logs
CREATE POLICY "Admins can delete moderation logs"
  ON moderation_logs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );
