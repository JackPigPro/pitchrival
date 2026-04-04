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
  // Remove blocking loading state - render page shell immediately
  // const [loading, setLoading] = useState(true)
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

      // Fetch current active duel by status
      let currentDuel = null

      // Find duel where status = 'active' ordered by start_date descending
      const { data: currentDuelData, error: currentDuelError } = await supabase
        .from('weekly_duel')
        .select('*')
        .eq('status', 'active')
        .order('start_date', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (currentDuelData && !currentDuelError) {
        currentDuel = currentDuelData
      } else {
        // If no active duel, get the most recent completed duel
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
          .select('id, content, vote_score, vote_count, created_at, user_id')
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

      // Determine current state based on duel status from Supabase
      let state: 'active' | 'voting' | 'results' | 'between'
      let subDeadline: Date | null = null
      let voteDeadline: Date | null = null
      
      if (currentDuel) {
        // Use status column as source of truth
        if (currentDuel.status === 'active') {
          state = 'active'
          subDeadline = new Date(currentDuel.end_date)
        } else if (currentDuel.status === 'voting') {
          state = 'voting'
          voteDeadline = new Date(new Date(currentDuel.end_date).getTime() + 24 * 60 * 60 * 1000) // Add 24 hours
        } else if (currentDuel.status === 'completed') {
          state = 'results'
        } else {
          // Fallback to 'between' for any other status
          state = 'between'
        }
      } else {
        state = 'between'
      }

      setCurrentState(state)
      setSubmissionDeadline(subDeadline)
      setVotingDeadline(voteDeadline)
      

    } catch (error) {
      console.error('Error fetching data:', error)
      // Remove setLoading(false) - no blocking loading
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

  // Remove blocking loading check - render page shell immediately
  // if (loading) {
  //   return (
  //     <div style={{ 
  //       display: 'flex', 
  //       justifyContent: 'center', 
  //       alignItems: 'center', 
  //       height: '100vh',
  //       fontSize: '18px',
  //       color: 'var(--text)',
  //       fontFamily: 'var(--font-body)'
  //     }}>
  //       Loading...
  //     </div>
  //   )
  // }

  // Provide skeleton data for immediate rendering
  const skeletonDuel = {
    id: 'skeleton',
    prompt: 'Loading prompt...',
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    status: 'active' as const,
    prize_distributed: false
  }
  
  const skeletonSubmission = {
    id: 'skeleton',
    content: '',
    vote_score: 0,
    vote_count: 0,
    created_at: new Date().toISOString(),
    user_id: user?.id || '',
    final_rank: undefined,
    elo_awarded: undefined
  }

  return (
    <WeeklyDuelClient 
      currentDuel={currentDuel || skeletonDuel}
      userSubmission={userSubmission || skeletonSubmission}
      allSubmissions={allSubmissions || []}
      pastWinners={pastWinners || []}
      currentState={currentState || 'between'}
      submissionDeadline={submissionDeadline}
      votingDeadline={votingDeadline}
      currentUserId={user?.id || ''}
      onRefresh={() => setRefreshTrigger(prev => prev + 1)}
    />
  )
}

