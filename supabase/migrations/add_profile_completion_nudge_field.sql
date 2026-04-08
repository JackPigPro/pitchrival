-- Add profile_completion_nudge_shown field to profiles table
ALTER TABLE profiles 
ADD COLUMN profile_completion_nudge_shown BOOLEAN DEFAULT FALSE;

-- Create index for better performance if needed
CREATE INDEX idx_profiles_profile_completion_nudge_shown ON profiles(profile_completion_nudge_shown);
