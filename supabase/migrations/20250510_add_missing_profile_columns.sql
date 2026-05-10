-- Add missing columns to profiles table
-- This migration adds all columns referenced in the codebase but missing from the database

-- Add email column (nullable, used in signup and auth flows)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Add auth_method column (nullable, used to track signup method)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS auth_method TEXT;

-- Add agreed_to_terms column (boolean with default false, used in onboarding)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS agreed_to_terms BOOLEAN DEFAULT false;

-- Add avatar column (nullable, used in onboarding)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Add open_to_cofounder column (nullable, used in cofounder matching)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS open_to_cofounder BOOLEAN;

-- Create indexes for frequently queried columns
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_auth_method ON profiles(auth_method);
CREATE INDEX idx_profiles_agreed_to_terms ON profiles(agreed_to_terms);
CREATE INDEX idx_profiles_open_to_cofounder ON profiles(open_to_cofounder);

-- Add comments for documentation
COMMENT ON COLUMN profiles.email IS 'User email address, stored lowercase';
COMMENT ON COLUMN profiles.auth_method IS 'Authentication method used: "email" or "google"';
COMMENT ON COLUMN profiles.agreed_to_terms IS 'Whether user agreed to terms during onboarding';
COMMENT ON COLUMN profiles.avatar IS 'Avatar identifier for user profile';
COMMENT ON COLUMN profiles.open_to_cofounder IS 'Whether user is open to cofounder requests';

-- Update existing records to set default values for non-nullable behavior
-- For existing users who completed onboarding before these columns existed
UPDATE profiles 
SET agreed_to_terms = true 
WHERE agreed_to_terms IS NULL 
AND onboarding_complete = true;

-- Set default auth_method for existing users based on their email presence
UPDATE profiles 
SET auth_method = CASE 
  WHEN email IS NOT NULL AND email != '' THEN 'email'
  ELSE 'google'
END 
WHERE auth_method IS NULL;
