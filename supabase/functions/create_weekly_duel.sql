-- Function to create a weekly duel with automatic date calculation
CREATE OR REPLACE FUNCTION create_weekly_duel(prompt_text TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    next_sunday TIMESTAMP WITH TIME ZONE;
    following_friday TIMESTAMP WITH TIME ZONE;
    new_duel_id UUID;
BEGIN
    -- Calculate next Sunday at 12:00 PM EST
    next_sunday := (
        CASE 
            WHEN EXTRACT(DOW FROM CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York') = 0 THEN
                -- Today is Sunday, add 7 days to get next Sunday
                (CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York')::DATE + INTERVAL '7 days' + TIME '12:00:00'
            ELSE
                -- Find next Sunday
                (CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York')::DATE + 
                INTERVAL '((7 - EXTRACT(DOW FROM (CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York'))) % 7) days' + 
                TIME '12:00:00'
        END
    ) AT TIME ZONE 'America/New_York';
    
    -- Calculate following Friday at 11:59 PM EST
    following_friday := next_sunday + INTERVAL '5 days' - INTERVAL '1 minute';
    
    -- Convert to UTC for storage
    next_sunday := next_sunday AT TIME ZONE 'UTC';
    following_friday := following_friday AT TIME ZONE 'UTC';
    
    -- Create the duel
    INSERT INTO weekly_duel (
        prompt,
        start_date,
        end_date,
        status,
        prize_distributed,
        created_at
    ) VALUES (
        prompt_text,
        next_sunday,
        following_friday,
        'pending',
        FALSE,
        NOW()
    ) RETURNING id INTO new_duel_id;
    
    -- Return success response
    RETURN jsonb_build_object(
        'success', true,
        'duel_id', new_duel_id,
        'start_date_est', next_sunday AT TIME ZONE 'America/New_York',
        'end_date_est', following_friday AT TIME ZONE 'America/New_York',
        'message', 'Weekly duel created successfully'
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$;
