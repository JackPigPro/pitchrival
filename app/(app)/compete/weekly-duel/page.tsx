'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import WeeklyDuelClient from './WeeklyDuelClient'
import { useRouter } from 'next/navigation'

type Winner = {
  id: string;
  prompt: string;
  rank: number;
  elo_awarded: number;
  user_id: {
    username: string;
  };
  created_at: string;
  username: string;
}

export default function WeeklyDuelPage() {
  const [user, setUser] = useState<any>(null)
  const [currentDuel, setCurrentDuel] = useState<any>(null)
  const [userSubmission, setUserSubmission] = useState<any>(null)
  const [allSubmissions, setAllSubmissions] = useState<any[]>([])
  const [pastWinners, setPastWinners] = useState<Winner[]>([])
  const [currentState, setCurrentState] = useState<'active' | 'voting' | 'results' | 'between'>('between')
  const [submissionDeadline, setSubmissionDeadline] = useState<Date | null>(null)
  const [votingDeadline, setVotingDeadline] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const router = useRouter()

  const fetchData = async () => {
    try {
      const supabase = createClient()
      
      // Check if user is authenticated
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push('/login')
        return
      }

      setUser(authUser)

      // Fetch current duel based on dates, not status
      let currentDuel = null
      const now = new Date()
      const nowUTC = now.toISOString()

      // Find duel where start_date <= now AND end_date > now (current active duel)
      const { data: currentDuelData, error: currentDuelError } = await supabase
        .from('weekly_duel')
        .select('*')
        .lte('start_date', nowUTC)
        .gt('end_date', nowUTC)
        .order('start_date', { ascending: false })
        .limit(1)
        .maybeSingle()

      // Debug logging
      console.log('Current time UTC:', nowUTC)
      console.log('Current duel data:', currentDuelData)
      console.log('Current duel error:', currentDuelError)

      if (currentDuelData && !currentDuelError) {
        currentDuel = currentDuelData
      } else {
        // If no current duel, get the most recent completed duel
        const { data: completedDuel, error: completedError } = await supabase
          .from('weekly_duel')
          .select('*')
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        
        currentDuel = completedDuel
      }

      setCurrentDuel(currentDuel)

      // Fetch user's submission for current duel
      if (currentDuel) {
        const { data: userSub } = await supabase
          .from('duel_submissions')
          .select('*')
          .eq('duel_id', currentDuel.id)
          .eq('user_id', authUser.id)
          .single()

        setUserSubmission(userSub)

        // Fetch all submissions for current duel
        const { data: allSubs } = await supabase
          .from('duel_submissions')
          .select('id, content, vote_score, vote_count, created_at')
          .eq('duel_id', currentDuel.id)
          .order('vote_score', { ascending: false })

        setAllSubmissions(allSubs || [])
      }

      // Fetch past winners with separate queries
      // 1. First fetch completed duels
      const { data: completedDuels } = await supabase
        .from('weekly_duel')
        .select('id, prompt, created_at, status, prize_distributed')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(10)

      if (completedDuels && completedDuels.length > 0) {
        // 2. Fetch duel_winners for those duel ids
        const duelIds = completedDuels.map(duel => duel.id)
        const { data: winners } = await supabase
          .from('duel_winners')
          .select('rank, elo_awarded, user_id, duel_id')
          .in('duel_id', duelIds)

        // 3. Fetch usernames from profiles
        if (winners && winners.length > 0) {
          const userIds = winners.map(w => w.user_id)
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', userIds)

          // 4. Merge data in JavaScript
          const profileMap = new Map(profiles?.map(p => [p.id, p.username]) || [])
          const transformedWinners: Winner[] = winners.map(winner => {
            const duel = completedDuels.find(d => d.id === winner.duel_id)
            const username = profileMap.get(winner.user_id) || 'Unknown'
            return {
              id: winner.duel_id,
              prompt: duel?.prompt || '',
              rank: winner.rank,
              elo_awarded: winner.elo_awarded,
              user_id: {
                username: username
              },
              created_at: duel?.created_at || '',
              username: username
            }
          })
          setPastWinners(transformedWinners)
        }
      }

      // Determine current state based on timing and duel status
      const estTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
      const dayOfWeek = estTime.getDay() // 0 = Sunday, 6 = Saturday
      const hour = estTime.getHours()
      
      let state: 'active' | 'voting' | 'results' | 'between'
      let subDeadline: Date | null = null
      let voteDeadline: Date | null = null
      
      if (currentDuel) {
        // If duel is already completed, show results regardless of time
        if (currentDuel.status === 'completed') {
          state = 'results'
        }
        // Otherwise use time-based logic for active/voting duels
        else {
          const startDate = new Date(currentDuel.start_date)
          const endDate = new Date(currentDuel.end_date)
          
          // Active: Sunday 12:00am to Friday 11:59pm EST
          if (dayOfWeek >= 0 && dayOfWeek <= 5 && hour < 23) { // Sunday-Friday before 11:59pm
            state = 'active'
            subDeadline = endDate
          }
          // Voting: Saturday 12:00am to Saturday 11:59pm EST
          else if (dayOfWeek === 6 && hour < 23) { // Saturday before 11:59pm
            state = 'voting'
            voteDeadline = new Date(endDate.getTime() + 24 * 60 * 60 * 1000) // Add 24 hours
          }
          // Results: After Saturday 11:59pm EST
          else {
            state = 'results'
          }
        }
      } else {
        state = 'between'
      }

      setCurrentState(state)
      setSubmissionDeadline(subDeadline)
      setVotingDeadline(voteDeadline)

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [refreshTrigger])

  // Set up real-time subscription
  useEffect(() => {
    const supabase = createClient()
    
    const subscription = supabase
      .channel('weekly_duel_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weekly_duel'
        },
        (payload) => {
          console.log('Weekly duel changed:', payload)
          setRefreshTrigger(prev => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  // Poll as fallback every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: 'var(--text)',
        fontFamily: 'var(--font-body)'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <WeeklyDuelClient 
      currentDuel={currentDuel}
      userSubmission={userSubmission}
      allSubmissions={allSubmissions || []}
      pastWinners={pastWinners || []}
      currentState={currentState}
      submissionDeadline={submissionDeadline}
      votingDeadline={votingDeadline}
      currentUserId={user?.id}
      onRefresh={() => setRefreshTrigger(prev => prev + 1)}
    />
  )
}

