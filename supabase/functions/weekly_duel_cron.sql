-- Cron job to manage weekly duel lifecycle
-- Note: If pg_cron is not available, use this as Edge Function instead

-- Job 1: Start voting every Saturday at 12:00 AM EST
SELECT cron.schedule(
  'start-weekly-voting',
  '0 12 * * 6', -- Every Saturday at 12:00 PM UTC (7:00 AM EST)
  $$
BEGIN
  -- Find current active duel and set to voting
  UPDATE weekly_duel 
  SET status = 'voting'
  WHERE status = 'active';
  
  -- Find next active duel and make it current
  UPDATE weekly_duel 
  SET status = 'active'
  WHERE id = (
    SELECT id 
    FROM weekly_duel 
    WHERE status = 'pending' 
    ORDER BY created_at ASC 
    LIMIT 1
  );
  
  -- Log the transition
  INSERT INTO system_logs (event_type, details)
  VALUES ('weekly_duel_voting_start', jsonb_build_object('timestamp', NOW(), 'action', 'Started voting phase'));
END;
$$
);

-- Job 2: End voting and distribute prizes every Saturday at 11:59 PM EST
SELECT cron.schedule(
  'end-weekly-voting',
  '59 23 * * 6', -- Every Saturday at 11:59 PM UTC (6:59 PM EST)
  $$
DECLARE
  current_duel_id UUID;
BEGIN
  -- Find duel that's in voting status with prizes not distributed
  SELECT id INTO current_duel_id
  FROM weekly_duel 
  WHERE status = 'voting' 
    AND prize_distributed = FALSE
  LIMIT 1;
  
  IF current_duel_id IS NOT NULL THEN
    -- Distribute prizes
    PERFORM distribute_duel_prizes(current_duel_id);
    
    -- Find next pending duel and make it active
    UPDATE weekly_duel 
    SET status = 'active'
    WHERE id = (
      SELECT id 
      FROM weekly_duel 
      WHERE status = 'pending' 
      ORDER BY created_at ASC 
      LIMIT 1
    );
    
    -- Log the transition
    INSERT INTO system_logs (event_type, details)
    VALUES ('weekly_duel_prize_distribution', jsonb_build_object('duel_id', current_duel_id, 'timestamp', NOW(), 'action', 'Distributed prizes and started next duel'));
  END IF;
END;
$$);
