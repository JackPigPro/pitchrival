-- Create RLS policies for profiles table
-- These policies allow users to read and update their own profile
-- All profiles on BizYip are public by design

-- Enable RLS on profiles table if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone (authenticated and anonymous) to read any profile
CREATE POLICY "Public profile access"
ON profiles FOR SELECT
USING (true);

-- Policy to allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy to allow users to insert their own profile (during signup)
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);
