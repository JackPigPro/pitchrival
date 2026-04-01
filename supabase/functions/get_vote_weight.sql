-- Function to calculate vote weight based on voter's ELO tier
CREATE OR REPLACE FUNCTION get_vote_weight(voter_elo INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF voter_elo >= 0 AND voter_elo <= 499 THEN
    RETURN 1; -- Trainee
  ELSIF voter_elo >= 500 AND voter_elo <= 749 THEN
    RETURN 1; -- Builder
  ELSIF voter_elo >= 750 AND voter_elo <= 999 THEN
    RETURN 1.5; -- Creator
  ELSIF voter_elo >= 1000 AND voter_elo <= 1249 THEN
    RETURN 2; -- Founder
  ELSIF voter_elo >= 1250 AND voter_elo <= 1499 THEN
    RETURN 2.5; -- Visionary
  ELSIF voter_elo >= 1500 AND voter_elo <= 1749 THEN
    RETURN 3; -- Icon
  ELSIF voter_elo >= 1750 AND voter_elo <= 1999 THEN
    RETURN 4; -- Titan
  ELSIF voter_elo >= 2000 THEN
    RETURN 5; -- Unicorn
  ELSE
    RETURN 1; -- Default
  END IF;
END;
$$;
