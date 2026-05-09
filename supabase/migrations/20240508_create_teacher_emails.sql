-- Create teacher_emails table for Learn launch notifications
CREATE TABLE IF NOT EXISTS teacher_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_teacher_emails_email ON teacher_emails(email);

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_teacher_emails_status ON teacher_emails(status);

-- Add RLS policies
ALTER TABLE teacher_emails ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their own email
CREATE POLICY "Users can insert their own email" ON teacher_emails
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read their own email (for checking if already subscribed)
CREATE POLICY "Users can read emails" ON teacher_emails
  FOR SELECT USING (true);

-- Prevent updates to maintain data integrity
CREATE POLICY "No updates allowed" ON teacher_emails
  FOR UPDATE USING (false);

-- Prevent deletes except by service role
CREATE POLICY "No deletes allowed" ON teacher_emails
  FOR DELETE USING (false);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_teacher_emails_updated_at 
  BEFORE UPDATE ON teacher_emails 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
