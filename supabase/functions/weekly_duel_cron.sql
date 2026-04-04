-- Cron job to manage weekly duel lifecycle
-- New Schedule (all times EST = UTC-5):
-- Monday 12:00 AM EST: Complete current duel, activate next queued duel
-- Sunday 12:00 AM EST: Start voting phase
-- Sunday 11:59 PM EST: Distribute prizes and activate next duel

-- Job 1: Monday transition - Complete current duel and activate next
SELECT cron.schedule(
  'monday-duel-transition',
  '0 5 * * 1', -- Every Monday at 12:00 AM EST (5:00 AM UTC)
  $$
BEGIN
  -- Find current weekly duel with status 'voting' or 'completed' and set it to 'completed'
  UPDATE weekly_duel 
  SET status = 'completed'
  WHERE status IN ('voting', 'active');
  
  -- Find the next queued duel (status 'queued') and set it to 'active'
  UPDATE weekly_duel 
  SET status = 'active'
  WHERE id = (
    SELECT id 
    FROM weekly_duel 
    WHERE status = 'queued' 
    ORDER BY start_date ASC 
    LIMIT 1
  );
  
  -- Log the transition
  INSERT INTO system_logs (event_type, details)
  VALUES ('monday_duel_transition', jsonb_build_object('timestamp', NOW(), 'action', 'Monday transition: completed current duel, activated next queued duel'));
END;
$$
);

-- Job 2: Sunday start voting
SELECT cron.schedule(
  'sunday-start-voting',
  '0 5 * * 0', -- Every Sunday at 12:00 AM EST (5:00 AM UTC)
  $$
BEGIN
  -- Find current 'active' duel and set status to 'voting'
  UPDATE weekly_duel 
  SET status = 'voting'
  WHERE status = 'active';
  
  -- Log the transition
  INSERT INTO system_logs (event_type, details)
  VALUES ('sunday_voting_start', jsonb_build_object('timestamp', NOW(), 'action', 'Started voting phase for active duel'));
END;
$$
);

-- Job 3: Sunday prize distribution
SELECT cron.schedule(
  'sunday-prize-distribution',
  '59 23 * * 0', -- Every Sunday at 11:59 PM EST (4:59 AM UTC Monday)
  $$
DECLARE
  current_duel_id UUID;
BEGIN
  -- Find the current 'voting' duel
  SELECT id INTO current_duel_id
  FROM weekly_duel 
  WHERE status = 'voting' 
  LIMIT 1;
  
  IF current_duel_id IS NOT NULL THEN
    -- Call distribute_duel_prizes on the current 'voting' duel
    PERFORM distribute_duel_prizes(current_duel_id);
    
    -- Update top 3 in duel_winners (handled by distribute_duel_prizes function)
    
    -- Activate the next 'queued' duel if one exists
    UPDATE weekly_duel 
    SET status = 'active'
    WHERE id = (
      SELECT id 
      FROM weekly_duel 
      WHERE status = 'queued' 
      ORDER BY start_date ASC 
      LIMIT 1
    );
    
    -- Log the transition
    INSERT INTO system_logs (event_type, details)
    VALUES ('sunday_prize_distribution', jsonb_build_object('duel_id', current_duel_id, 'timestamp', NOW(), 'action', 'Distributed prizes and activated next queued duel'));
  END IF;
END;
$$
);
