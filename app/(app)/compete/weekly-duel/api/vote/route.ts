import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { winner_submission_id, loser_submission_id } = await request.json()
    
    if (!winner_submission_id || !loser_submission_id) {
      return NextResponse.json(
        { error: 'Missing winner_submission_id or loser_submission_id' },
        { status: 400 }
      )
    }

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get user's current ELO
    const { data: userStats } = await supabase
      .from('user_stats')
      .select('elo')
      .eq('user_id', user.id)
      .single()

    if (!userStats) {
      return NextResponse.json(
        { error: 'User stats not found' },
        { status: 404 }
      )
    }

    // Get voter's vote weight based on ELO
    const voteWeight = userStats.elo ? await supabase
      .rpc('get_vote_weight', { params: { voter_elo: userStats.elo } })
      .single()

    if (!voteWeight) {
      return NextResponse.json(
        { error: 'Failed to calculate vote weight' },
        { status: 500 }
      )
    }

    // Get duel_id for validation
    const { data: duelData } = await supabase
      .from('duel_submissions')
      .select('duel_id')
      .eq('id', winner_submission_id)
      .single()

    // Call the submit_vote function
    const { data, error } = await supabase
      .rpc('submit_vote', { 
        params: { 
          voter_id_param: user.id,
          duel_id_param: duelData?.duel_id,
          winner_submission_id,
          loser_submission_id
        }
      })

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Vote submission failed' },
        { status: 500 }
      )
    }

    // Award voter +1 ELO for voting
    const { error: eloUpdateError } = await supabase
      .from('user_stats')
      .update({ elo: userStats.elo + 1 })
      .eq('user_id', user.id)

    if (eloUpdateError) {
      return NextResponse.json(
        { error: 'Failed to update user ELO' },
        { status: 500 }
      )
    }

    // Log ELO change to history
    const { error: historyError } = await supabase
      .from('elo_history')
      .insert({
        user_id: user.id,
        elo_change: 1,
        new_elo: userStats.elo + 1,
        reason: 'duel_vote'
      })

    if (historyError) {
      return NextResponse.json(
        { error: 'Failed to log ELO change' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true,
        elo_change: data?.elo_change || 1,
        new_elo: userStats.elo + 1
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
