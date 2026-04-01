# Weekly Duel Backend Setup

## Database Tables Used
- `weekly_duel` — id, prompt, start_date, end_date, status (active/voting/completed), prize_distributed
- `duel_submissions` — id, user_id, duel_id, content, vote_score, vote_count, final_rank, elo_awarded
- `duel_votes` — id, voter_id, duel_id, winner_submission_id, loser_submission_id, voter_elo, vote_weight, vote_score, vote_count
- `seen_pairs` — id, voter_id, duel_id, submission_a_id, submission_b_id
- `duel_winners` — id, duel_id, user_id, rank, elo_awarded
- `user_stats` — user_id, elo, rank
- `elo_history` — user_id, elo_change, new_elo, reason
- `system_logs` — event_type, details (for cron job logging)

## Created Functions

### 1. get_vote_weight()
**File:** `supabase/functions/get_vote_weight.sql`
**Purpose:** Calculate vote weight based on voter's ELO tier
**Tiers:**
- Trainee (0-499): 1
- Builder (500-749): 1
- Creator (750-999): 1.5
- Founder (1000-1249): 2
- Visionary (1250-1499): 2.5
- Icon (1500-1749): 3
- Titan (1750-1999): 4
- Unicorn (2000+): 5

### 2. submit_vote()
**File:** `supabase/functions/submit_vote.sql`
**Purpose:** Submit a vote with ELO-style rating and cooldown enforcement
**Features:**
- Gets voter's current ELO
- Calculates vote weight using get_vote_weight()
- Enforces 30-second cooldown between votes
- Updates vote scores and counts on both submissions
- Inserts vote into duel_votes
- Inserts pair into seen_pairs to prevent re-voting
- Awards voter +1 ELO for voting (logged to elo_history)
- Returns success/error JSON

### 3. distribute_duel_prizes()
**File:** `supabase/functions/distribute_duel_prizes.sql`
**Purpose:** Rank submissions and award ELO prizes based on final rank
**Prizes:**
- 1st place: +100 ELO
- 2nd place: +90 ELO
- 3rd place: +80 ELO
- 4th-5th place: +60 ELO
- 6th-10th place: +40 ELO
- 11th+ place: +10 ELO (participation bonus, only if they submitted)
**Features:**
- Ranks submissions by vote_score descending (earlier submissions get tiebreaker)
- Updates final_rank and elo_awarded on each submission
- Updates user_stats.elo for winners
- Logs ELO changes to elo_history with 'weekly_duel_prize' reason
- Inserts winners into duel_winners table
- Marks weekly_duel as completed with prize_distributed = true

### 4. weekly_duel_cron()
**File:** `supabase/functions/weekly_duel_cron.sql`
**Purpose:** Automated weekly duel lifecycle management via pg_cron
**Schedule (EST):**
- Every Saturday at 12:00 AM: Start voting phase
  - Sets current 'active' duel to 'voting'
  - Sets next 'pending' duel to 'active'
- Every Saturday at 11:59 PM: End voting and distribute prizes
  - Calls distribute_duel_prizes() for current voting duel
  - Sets next 'pending' duel to 'active'
  - Logs all transitions to system_logs

## Deployment Notes

### If pg_cron is available:
```sql
-- Install the cron extension first
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Then run the cron setup
\i weekly_duel_cron.sql
```

### If pg_cron is NOT available (use Supabase Edge Functions):
1. Create Edge Function for voting start (Saturday 12:00 AM EST)
2. Create Edge Function for prize distribution (Saturday 11:59 PM EST)
3. Set up cron schedules in Supabase dashboard to call these functions
4. Move cron logic from weekly_duel_cron.sql into the Edge Functions

## Function Dependencies
- `get_vote_weight()` must be created first (used by submit_vote)
- `submit_vote()` uses user_stats, duel_submissions, duel_votes, seen_pairs, elo_history
- `distribute_duel_prizes()` uses user_stats, duel_submissions, duel_winners, elo_history
- `weekly_duel_cron()` uses weekly_duel, system_logs, calls distribute_duel_prizes()

## Security & Policies
- RLS policies should allow:
  - Users can vote in duels they haven't voted on
  - Users can submit to active duels
  - Users can view all duel data
  - System functions can modify duel and user data
  - Vote weights are calculated based on verified ELO data

## Testing
- Test vote weight calculations with different ELO levels
- Test 30-second cooldown enforcement
- Test prize distribution with various submission counts
- Test cron schedules manually before deploying
- Verify ELO changes are logged correctly to elo_history
