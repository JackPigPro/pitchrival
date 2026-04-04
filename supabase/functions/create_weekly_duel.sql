-- Function to create a weekly duel with specified dates
CREATE OR REPLACE FUNCTION create_weekly_duel(prompt_text TEXT, start_date TIMESTAMP WITH TIME ZONE, end_date TIMESTAMP WITH TIME ZONE)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_duel_id UUID;
    calculated_status TEXT;
BEGIN
    -- Determine status based on current time and provided dates
    -- Convert current time to EST for comparison
    DECLARE
        current_time_est TIMESTAMP WITH TIME ZONE := CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York';
        start_date_est TIMESTAMP WITH TIME ZONE := start_date AT TIME ZONE 'America/New_York';
        end_date_est TIMESTAMP WITH TIME ZONE := end_date AT TIME ZONE 'America/New_York';
    BEGIN
        -- If current time is before start date, status should be 'queued'
        IF current_time_est < start_date_est THEN
            calculated_status := 'queued';
        -- If current time is between start_date and end_date, status should be 'active'
        ELSIF current_time_est >= start_date_est AND current_time_est < end_date_est THEN
            calculated_status := 'active';
        -- If current time is after end_date but before end_date + 24 hours, status should be 'voting'
        ELSIF current_time_est >= end_date_est AND current_time_est < (end_date_est + INTERVAL '24 hours') THEN
            calculated_status := 'voting';
        -- Otherwise, status should be 'queued' (future duel)
        ELSE
            calculated_status := 'queued';
        END IF;
    END;
    
    -- Create the duel with exact dates provided
    INSERT INTO weekly_duel (
        prompt,
        start_date,
        end_date,
        status,
        prize_distributed,
        created_at
    ) VALUES (
        prompt_text,
        start_date,
        end_date,
        calculated_status,
        FALSE,
        NOW()
    ) RETURNING id INTO new_duel_id;
    
    -- Return success response
    RETURN jsonb_build_object(
        'success', true,
        'duel_id', new_duel_id,
        'start_date_est', start_date AT TIME ZONE 'America/New_York',
        'end_date_est', end_date AT TIME ZONE 'America/New_York',
        'status', calculated_status,
        'message', 'Weekly duel created successfully'
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$;
