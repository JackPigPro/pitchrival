-- Create tables for 1v1 live battle feature

-- Matches table
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_mode TEXT NOT NULL CHECK (game_mode IN ('logo', 'business_idea')),
    status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'voting', 'complete')),
    player1_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    player2_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    prompt TEXT,
    time_limit_seconds INTEGER NOT NULL CHECK (time_limit_seconds IN (60, 300)),
    player1_submitted BOOLEAN DEFAULT false,
    player2_submitted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    room_code TEXT,
    is_private BOOLEAN DEFAULT false,
    winner_id UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Create indexes for matches
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_game_mode ON matches(game_mode);
CREATE INDEX idx_matches_room_code ON matches(room_code) WHERE room_code IS NOT NULL;
CREATE INDEX idx_matches_players ON matches(player1_id, player2_id);
CREATE INDEX idx_matches_created_at ON matches(created_at DESC);

-- Match submissions table
CREATE TABLE match_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT, -- for business_idea mode
    image_url TEXT, -- for logo mode
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(match_id, user_id)
);

-- Create indexes for match_submissions
CREATE INDEX idx_match_submissions_match_id ON match_submissions(match_id);
CREATE INDEX idx_match_submissions_user_id ON match_submissions(user_id);

-- Match votes table
CREATE TABLE match_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    voter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    voted_for_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(match_id, voter_id)
);

-- Create indexes for match_votes
CREATE INDEX idx_match_votes_match_id ON match_votes(match_id);
CREATE INDEX idx_match_votes_voter_id ON match_votes(voter_id);
CREATE INDEX idx_match_votes_voted_for_id ON match_votes(voted_for_id);

-- Row Level Security policies
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_votes ENABLE ROW LEVEL SECURITY;

-- Matches RLS policies
CREATE POLICY "Users can view matches they participate in" ON matches
    FOR SELECT USING (
        auth.uid() = player1_id OR 
        auth.uid() = player2_id OR
        is_private = false
    );

CREATE POLICY "Users can create matches" ON matches
    FOR INSERT WITH CHECK (auth.uid() = player1_id);

CREATE POLICY "Users can update matches they participate in" ON matches
    FOR UPDATE USING (
        auth.uid() = player1_id OR 
        auth.uid() = player2_id
    );

-- Match submissions RLS policies
CREATE POLICY "Users can view submissions for their matches" ON match_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM matches 
            WHERE matches.id = match_submissions.match_id 
            AND (matches.player1_id = auth.uid() OR matches.player2_id = auth.uid())
        )
    );

CREATE POLICY "Users can create submissions for their matches" ON match_submissions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM matches 
            WHERE matches.id = match_submissions.match_id 
            AND (matches.player1_id = auth.uid() OR matches.player2_id = auth.uid())
        ) AND auth.uid() = user_id
    );

-- Match votes RLS policies
CREATE POLICY "Users can view votes for their matches" ON match_votes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM matches 
            WHERE matches.id = match_votes.match_id 
            AND (matches.player1_id = auth.uid() OR matches.player2_id = auth.uid())
        )
    );

CREATE POLICY "Users can create votes for matches they participate in" ON match_votes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM matches 
            WHERE matches.id = match_votes.match_id 
            AND (matches.player1_id = auth.uid() OR matches.player2_id = auth.uid())
        ) AND auth.uid() = voter_id AND auth.uid() != voted_for_id
    );

CREATE POLICY "Users can only vote once per match" ON match_votes
    FOR INSERT WITH CHECK (
        NOT EXISTS (
            SELECT 1 FROM match_votes mv 
            WHERE mv.match_id = match_votes.match_id 
            AND mv.voter_id = auth.uid()
        )
    );
