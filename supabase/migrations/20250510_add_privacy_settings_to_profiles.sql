-- Add privacy settings to profiles table
ALTER TABLE profiles 
ADD COLUMN public_profile BOOLEAN DEFAULT true,
ADD COLUMN show_elo_on_profile BOOLEAN DEFAULT true,
ADD COLUMN appear_on_leaderboard BOOLEAN DEFAULT true;

-- Add comment to explain the new fields
COMMENT ON COLUMN profiles.public_profile IS 'Whether the user''s profile is publicly visible';
COMMENT ON COLUMN profiles.show_elo_on_profile IS 'Whether to display ELO rating on public profile';
COMMENT ON COLUMN profiles.appear_on_leaderboard IS 'Whether the user appears on public leaderboards';
