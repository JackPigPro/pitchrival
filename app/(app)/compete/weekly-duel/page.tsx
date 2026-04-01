import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import WeeklyDuelClient from './WeeklyDuelClient'

export default async function WeeklyDuelPage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch current active duel
  const { data: currentDuel, error: duelError } = await supabase
    .from('weekly_duel')
    .select('*')
    .eq('status', 'active')
    .single()

  if (duelError) {
    console.error('Error fetching current duel:', duelError)
  }

  // Fetch user's submission for current duel
  const { data: userSubmission, error: submissionError } = await supabase
    .from('duel_submissions')
    .select('*')
    .eq('duel_id', currentDuel?.id || '')
    .eq('user_id', user.id)
    .single()

  // Fetch all submissions for current duel (to count)
  const { data: allSubmissions, error: allSubmissionsError } = await supabase
    .from('duel_submissions')
    .select('id, content, vote_score, vote_count, created_at')
    .eq('duel_id', currentDuel?.id || '')
    .order('vote_score', { ascending: false })

  if (allSubmissionsError) {
    console.error('Error fetching submissions:', allSubmissionsError)
  }

  // Fetch past winners
  const { data: pastWinners, error: winnersError } = await supabase
    .from('weekly_duel')
    .select('id, prompt, created_at, status, prize_distributed')
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(10)

  if (winnersError) {
    console.error('Error fetching winners:', winnersError)
  }

  // Get winners with their user data
  const { data: winnersWithUsers, error: winnersUsersError } = await supabase
    .from('weekly_duel')
    .select(`
      id, prompt, created_at, status, prize_distributed,
      duel_winners!inner(
        rank, elo_awarded,
        user_id!inner(
          username
        )
      )
    `)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(10)

  // Transform nested data to flat Winner array
  const transformedWinners: Winner[] = (winnersWithUsers || []).map(duel => {
    const winner = duel.duel_winners?.[0] // Get first winner
    return winner ? {
      id: duel.id,
      rank: winner.rank,
      elo_awarded: winner.elo_awarded,
      user_id: winner.user_id.username,
      username: winner.user_id.username,
      created_at: duel.created_at
    } : null as any
  }).filter(Boolean) // Remove null entries

  if (winnersUsersError) {
    console.error('Error fetching winners with users:', winnersUsersError)
  }

  // Determine current state based on timing
  const now = new Date()
  const estTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
  const dayOfWeek = estTime.getDay() // 0 = Sunday, 6 = Saturday
  const hour = estTime.getHours()
  
  let currentState: 'active' | 'voting' | 'results' | 'between'
  let submissionDeadline: Date | null = null
  let votingDeadline: Date | null = null
  
  if (currentDuel) {
    const startDate = new Date(currentDuel.start_date)
    const endDate = new Date(currentDuel.end_date)
    
    // Active: Sunday 12:00am to Friday 11:59pm EST
    if (dayOfWeek >= 0 && dayOfWeek <= 5 && hour < 23) { // Sunday-Friday before 11:59pm
      currentState = 'active'
      submissionDeadline = endDate
    }
    // Voting: Saturday 12:00am to Saturday 11:59pm EST
    else if (dayOfWeek === 6 && hour < 23) { // Saturday before 11:59pm
      currentState = 'voting'
      votingDeadline = new Date(endDate)
    }
    // Results: After Saturday 11:59pm EST
    else {
      currentState = 'results'
    }
  } else {
    currentState = 'between'
  }

  return (
    <WeeklyDuelClient 
      currentDuel={currentDuel}
      userSubmission={userSubmission}
      allSubmissions={allSubmissions || []}
      pastWinners={winnersWithUsers || []}
      currentState={currentState}
      submissionDeadline={submissionDeadline}
      votingDeadline={votingDeadline}
      currentUserId={user.id}
    />
  )
}

