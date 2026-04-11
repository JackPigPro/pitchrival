'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/utils/supabase/client'

interface ClassData {
  id: string
  teacher_id: string
  name: string
  school_name: string
  role: string
  join_code: string
  student_count: number
  created_at: string
  profiles: {
    username: string
  }
}

interface Prompt {
  id: string
  class_id: string
  title: string
  content: string
  mode: 'bellringer' | 'competition'
  is_live: boolean
  status: 'scheduled' | 'active' | 'voting' | 'completed'
  start_time?: string
  end_time?: string
  duration_minutes?: number
  submission_count: number
  created_at: string
}

interface Submission {
  id: string
  prompt_id: string
  user_id: string
  submission_text: string
  submitted_at: string
}

interface LeaderboardEntry {
  user_id: string
  username: string
  elo: number
  rank: string
}

const getRankColor = (rank: string) => {
  switch (rank) {
    case 'Trainee': return '#9ca3af' // grey
    case 'Builder': return '#3b82f6' // blue
    case 'Creator': return '#22c55e' // green
    case 'Founder': return '#eab308' // gold
    case 'Visionary': return '#a855f7' // purple
    case 'Icon': return '#f97316' // orange
    case 'Titan': return '#ef4444' // red
    case 'Unicorn': return 'linear-gradient(135deg, #7c3aed, #ec4899, #10b981)' // rainbow gradient
    default: return '#9ca3af'
  }
}

const getRankFaintColor = (rank: string) => {
  switch (rank) {
    case 'Trainee': return 'rgba(156, 163, 175, 0.25)' // faint grey
    case 'Builder': return 'rgba(59, 130, 246, 0.25)' // faint blue
    case 'Creator': return 'rgba(34, 197, 94, 0.25)' // faint green
    case 'Founder': return 'rgba(234, 179, 8, 0.25)' // faint gold
    case 'Visionary': return 'rgba(168, 85, 247, 0.25)' // faint purple
    case 'Icon': return 'rgba(249, 115, 22, 0.25)' // faint orange
    case 'Titan': return 'rgba(239, 68, 68, 0.25)' // faint red
    case 'Unicorn': return 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(236, 72, 153, 0.25), rgba(16, 185, 129, 0.25))' // faint rainbow gradient
    default: return 'rgba(156, 163, 175, 0.25)'
  }
}

interface StudentClassClientProps {
  classData: ClassData
}

interface VotingUIProps {
  promptId: string
  voteCooldown: number
  setVoteCooldown: (cooldown: number) => void
  setEloToast: (toast: { show: boolean; message: string } | null) => void
}

function VotingUI({ promptId, voteCooldown, setVoteCooldown, setEloToast }: VotingUIProps) {
  const supabase = createClient()
  const [currentMatchup, setCurrentMatchup] = useState<{ left: any; right: any } | null>(null)
  const [matchupCount, setMatchupCount] = useState(0)
  const [totalMatchups, setTotalMatchups] = useState(0)
  const [loading, setLoading] = useState(true)
  const [votedMatchups, setVotedMatchups] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchNextMatchup()
  }, [])

  const fetchNextMatchup = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_next_voting_matchup', { 
          prompt_id: promptId,
          user_id: supabase.auth.getUser().then(({ data: { user } }) => user?.id || '')
        })

      if (error) throw error

      if (data) {
        setCurrentMatchup(data)
        setMatchupCount(data.matchup_number || 0)
        setTotalMatchups(data.total_matchups || 0)
      } else {
        setCurrentMatchup(null)
      }
    } catch (error) {
      console.error('Error fetching matchup:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (winnerId: string, loserId: string) => {
    if (voteCooldown > 0) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .rpc('submit_class_vote', {
          prompt_id: promptId,
          winner_id: winnerId,
          loser_id: loserId,
          user_id: user.id
        })

      if (error) throw error

      // Add to voted matchups
      setVotedMatchups(prev => new Set(prev).add(`${winnerId}-${loserId}`))
      
      // Set cooldown
      setVoteCooldown(30)
      
      // Show ELO toast
      setEloToast({ show: true, message: '+1 ELO earned!' })
      setTimeout(() => setEloToast(null), 3000)

      // Fetch next matchup
      await fetchNextMatchup()
    } catch (error) {
      console.error('Error submitting vote:', error)
    }
  }

  if (loading) {
    return (
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '18px', color: 'var(--text2)' }}>
          Loading voting matchups...
        </div>
      </div>
    )
  }

  if (!currentMatchup) {
    return (
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '16px' }}>
          You've voted on all matchups!
        </div>
        <div style={{ fontSize: '16px', color: 'var(--text2)' }}>
          Thanks for participating in the voting.
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '32px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h3 style={{ 
          fontSize: '24px', 
          fontWeight: 700, 
          fontFamily: 'var(--font-display)',
          color: 'var(--text)',
          marginBottom: '8px'
        }}>
          Vote for the Better Response
        </h3>
        <div style={{ fontSize: '16px', color: 'var(--text2)' }}>
          Matchup {matchupCount} of {totalMatchups}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'stretch' }}>
        {/* Left submission */}
        <div style={{
          flex: 1,
          background: 'var(--surface)',
          border: '2px solid var(--border)',
          borderRadius: '12px',
          padding: '24px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onClick={() => handleVote(currentMatchup.left.id, currentMatchup.right.id)}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--green)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.transform = 'translateY(0)'
        }}>
          <div style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '16px' }}>
            Option A
          </div>
          <div style={{ 
            color: 'var(--text)', 
            fontFamily: 'var(--font-body)',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap'
          }}>
            {currentMatchup.left.submission_text}
          </div>
        </div>

        {/* VS */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 800,
          color: 'var(--text2)',
          fontFamily: 'var(--font-display)'
        }}>
          VS
        </div>

        {/* Right submission */}
        <div style={{
          flex: 1,
          background: 'var(--surface)',
          border: '2px solid var(--border)',
          borderRadius: '12px',
          padding: '24px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onClick={() => handleVote(currentMatchup.right.id, currentMatchup.left.id)}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--green)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.transform = 'translateY(0)'
        }}>
          <div style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '16px' }}>
            Option B
          </div>
          <div style={{ 
            color: 'var(--text)', 
            fontFamily: 'var(--font-body)',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap'
          }}>
            {currentMatchup.right.submission_text}
          </div>
        </div>
      </div>

      {/* Cooldown indicator */}
      {voteCooldown > 0 && (
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '16px',
          color: 'var(--text2)'
        }}>
          Next vote available in {voteCooldown}s
        </div>
      )}
    </div>
  )
}

export default function StudentClassClient({ classData }: StudentClassClientProps) {
  const { user } = useUser()
  const router = useRouter()
  const supabase = createClient()

  // State management
  const [activeTab, setActiveTab] = useState<'prompts' | 'leaderboard' | 'past'>('prompts')
  const [activePrompts, setActivePrompts] = useState<Prompt[]>([])
  const [pastPrompts, setPastPrompts] = useState<Prompt[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userSubmissions, setUserSubmissions] = useState<Map<string, Submission>>(new Map())
  const [loading, setLoading] = useState(false)
  const [livePrompt, setLivePrompt] = useState<Prompt | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [votingMode, setVotingMode] = useState(false)
  const [voteCooldown, setVoteCooldown] = useState<number>(0)
  const [eloToast, setEloToast] = useState<{ show: boolean; message: string } | null>(null)

  // Form states
  const [submissionTexts, setSubmissionTexts] = useState<Map<string, string>>(new Map())
  const [submitting, setSubmitting] = useState<Map<string, boolean>>(new Map())

  // Fetch data on tab changes (not on mount since data comes from server)
  useEffect(() => {
    if (activeTab !== 'prompts') {
      fetchTabData()
    }
  }, [activeTab])

  // Initialize prompts data on mount
  useEffect(() => {
    fetchActivePrompts()
  }, [])

  // Set up real-time subscriptions
  useEffect(() => {
    // Subscribe to class_prompts changes
    const promptsChannel = supabase
      .channel('class-prompts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'class_prompts',
          filter: `class_id=eq.${classData.id}`
        },
        (payload) => {
          console.log('Prompt change detected:', payload)
          // Handle live prompt changes
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const prompt = payload.new as Prompt
            if (prompt.is_live && (prompt.status === 'active' || prompt.status === 'voting')) {
              setLivePrompt(prompt)
              if (prompt.status === 'voting') {
                setVotingMode(true)
              }
            } else if (prompt.status === 'completed') {
              setLivePrompt(null)
              setVotingMode(false)
            }
          }
          
          // Refresh prompts when there are changes
          if (activeTab === 'prompts') {
            fetchActivePrompts()
          } else if (activeTab === 'past') {
            fetchPastPrompts()
          }
        }
      )
      .subscribe()

    // Subscribe to class_submissions changes for real-time counts
    const submissionsChannel = supabase
      .channel('class-submissions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'class_submissions'
        },
        (payload) => {
          console.log('New submission detected:', payload)
          // Update submission counts for active prompts
          if (activeTab === 'prompts') {
            setActivePrompts(prev => prev.map(prompt => {
              if (prompt.id === payload.new.prompt_id) {
                return { ...prompt, submission_count: prompt.submission_count + 1 }
              }
              return prompt
            }))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(promptsChannel)
      supabase.removeChannel(submissionsChannel)
    }
  }, [classData.id, activeTab])

  // Check for live prompts function
  const checkLivePrompt = async () => {
    try {
      const { data, error } = await supabase
        .from('class_prompts')
        .select('*')
        .eq('class_id', classData.id)
        .eq('is_live', true)
        .in('status', ['active', 'voting'])
        .single()

      if (data && !error) {
        setLivePrompt(data)
        if (data.status === 'voting') {
          setVotingMode(true)
        }
      }
    } catch (error) {
      console.error('Error checking live prompt:', error)
    }
  }

  // Check for live prompts on mount and set up countdown
  useEffect(() => {
    checkLivePrompt()
  }, [classData.id])

  // Countdown timer for live sessions
  useEffect(() => {
    if (!livePrompt || livePrompt.status !== 'active' || !livePrompt.end_time) {
      setTimeRemaining(0)
      return
    }

    const updateCountdown = () => {
      const now = new Date()
      const nowUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60000)
      const endTime = new Date(livePrompt.end_time!)
      const diff = endTime.getTime() - nowUTC.getTime()
      
      if (diff <= 0) {
        setTimeRemaining(0)
        // Automatically change status when timer hits zero
        handleAutoStatusChange()
      } else {
        setTimeRemaining(Math.floor(diff / 1000))
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [livePrompt])

  const handleAutoStatusChange = async () => {
    if (!livePrompt) return

    try {
      if (livePrompt.mode === 'competition') {
        // Competition: set to voting
        await supabase
          .from('class_prompts')
          .update({ status: 'voting' })
          .eq('id', livePrompt.id)
      } else {
        // Bellringer: set to completed
        await supabase
          .from('class_prompts')
          .update({ status: 'completed' })
          .eq('id', livePrompt.id)
      }

      // Refresh the live prompt
      await checkLivePrompt()
    } catch (error) {
      console.error('Error auto-changing prompt status:', error)
    }
  }

  // Vote cooldown timer
  useEffect(() => {
    if (voteCooldown <= 0) return

    const interval = setInterval(() => {
      setVoteCooldown(prev => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [voteCooldown])

  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const fetchTabData = async () => {
    setLoading(true)
    
    try {
      switch (activeTab) {
        case 'prompts':
          await fetchActivePrompts()
          break
        case 'leaderboard':
          await fetchLeaderboard()
          break
        case 'past':
          await fetchPastPrompts()
          break
      }
    } catch (error) {
      console.error('Error fetching tab data:', error)
    } finally {
      setLoading(false)
    }
  }

  
  const fetchActivePrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('class_prompts')
        .select('*')
        .eq('class_id', classData.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      setActivePrompts(data || [])

      // Fetch user's submissions for these prompts
      if (data && data.length > 0 && user) {
        const promptIds = data.map(p => p.id)
        const { data: submissions, error: submissionsError } = await supabase
          .from('class_submissions')
          .select('*')
          .eq('user_id', user.id)
          .in('prompt_id', promptIds)

        if (!submissionsError && submissions) {
          const submissionMap = new Map(
            submissions.map(s => [s.prompt_id, s])
          )
          setUserSubmissions(submissionMap)
        }
      }
    } catch (error) {
      console.error('Error fetching active prompts:', error)
    }
  }

  const fetchLeaderboard = async () => {
    try {
      // Fetch all students in the class
      const { data: members, error: membersError } = await supabase
        .from('class_members')
        .select('user_id')
        .eq('class_id', classData.id)

      if (membersError) throw membersError

      if (!members || members.length === 0) {
        setLeaderboard([])
        return
      }

      // Fetch user profiles for all students
      const userIds = members.map(m => m.user_id)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', userIds)

      if (profilesError) throw profilesError

      // Fetch ELO data for all students
      const { data: eloData, error: eloError } = await supabase
        .from('user_stats')
        .select('user_id, elo')
        .in('user_id', userIds)

      if (eloError) throw eloError

      // Merge data and create leaderboard entries
      const leaderboardEntries: LeaderboardEntry[] = members.map(member => {
        const profile = profiles?.find(p => p.id === member.user_id)
        const elo = eloData?.find(e => e.user_id === member.user_id)?.elo || 0
        
        // Calculate rank based on ELO
        let rank = 'Trainee'
        if (elo >= 2000) rank = 'Unicorn'
        else if (elo >= 1750) rank = 'Titan'
        else if (elo >= 1500) rank = 'Icon'
        else if (elo >= 1250) rank = 'Visionary'
        else if (elo >= 1000) rank = 'Founder'
        else if (elo >= 750) rank = 'Creator'
        else if (elo >= 500) rank = 'Builder'

        return {
          user_id: member.user_id,
          username: profile?.username || 'Unknown',
          elo,
          rank
        }
      }).sort((a, b) => b.elo - a.elo)

      setLeaderboard(leaderboardEntries)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    }
  }

  const fetchPastPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('class_prompts')
        .select('*')
        .eq('class_id', classData.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPastPrompts(data || [])
    } catch (error) {
      console.error('Error fetching past prompts:', error)
    }
  }

  const handleSubmitSubmission = async (promptId: string) => {
    if (!user) return

    const submissionText = submissionTexts.get(promptId) || ''
    if (!submissionText.trim()) return

    try {
      setSubmitting(prev => new Map(prev.set(promptId, true)))

      // Insert submission
      const { error } = await supabase
        .from('class_submissions')
        .insert({
          prompt_id: promptId,
          user_id: user.id,
          submission_text: submissionText.trim()
        })

      if (error) throw error

      // Update prompt submission count
      await supabase
        .from('class_prompts')
        .update({ submission_count: (activePrompts.find(p => p.id === promptId)?.submission_count || 0) + 1 })
        .eq('id', promptId)

      // Clear submission text
      setSubmissionTexts(prev => {
        const newMap = new Map(prev)
        newMap.delete(promptId)
        return newMap
      })

      // Refresh active prompts
      await fetchActivePrompts()
    } catch (error) {
      console.error('Error submitting:', error)
    } finally {
      setSubmitting(prev => new Map(prev.set(promptId, false)))
    }
  }

  const handleLeaveClass = async () => {
    if (!user) return

    try {
      // Delete the row from class_members where user_id = current user's id
      const { error } = await supabase
        .from('class_members')
        .delete()
        .eq('user_id', user.id)
        .eq('class_id', classData.id)

      if (error) {
        throw error
      }

      // Update student count
      console.log('Updating student count from', classData.student_count, 'to', Math.max(0, classData.student_count - 1))
      const { error: updateError } = await supabase
        .from('classes')
        .update({ student_count: Math.max(0, classData.student_count - 1) })
        .eq('id', classData.id)

      if (updateError) {
        console.error('Failed to update student count:', updateError)
      }

      // Clear any client-side cache to ensure fresh data
      if (typeof window !== 'undefined') {
        // Clear any potential client-side state
        localStorage.clear()
        sessionStorage.clear()
      }

      // Force a hard redirect with cache busting to ensure fresh server-side check
      const timestamp = Date.now()
      window.location.href = `/schools?t=${timestamp}`
    } catch (error) {
      // If delete fails, show an alert with the error
      console.error('Error leaving class:', error)
      alert(`Failed to leave class: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const getTimeRemaining = (endTime?: string) => {
    if (!endTime) return 'No end time'
    
    const now = new Date()
    const nowUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60000)
    const end = new Date(endTime)
    const diff = end.getTime() - nowUTC.getTime()
    
    if (diff <= 0) return 'Ended'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }

  const getModeBadge = (mode: string) => {
    const colors = {
      bellringer: 'var(--blue)',
      competition: 'var(--green)'
    }
    
    return (
      <span style={{
        background: colors[mode as keyof typeof colors],
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'capitalize'
      }}>
        {mode}
      </span>
    )
  }


  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--bg)',
      backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
      padding: '40px 24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div>
          <h1 style={{ 
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '8px',
            color: 'var(--text)'
          }}>
            {classData.name}
          </h1>
          <p style={{ 
            fontSize: '16px',
            color: 'var(--text-secondary)',
            marginBottom: '32px'
          }}>
            Teacher: {classData.profiles.username} · School: {classData.school_name}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '0'
        }}>
          {(['prompts', 'leaderboard', 'past'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--green)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--green)' : 'var(--text-secondary)',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'prompts' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>
              Active Prompts
            </h2>
            {activePrompts.length === 0 ? (
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '48px',
                textAlign: 'center',
                color: 'var(--text-secondary)'
              }}>
                No active prompts
              </div>
            ) : (
              activePrompts.map(prompt => (
                <div key={prompt.id} style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                        {prompt.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {getModeBadge(prompt.mode)}
                        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                          {getTimeRemaining(prompt.end_time)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text)', marginBottom: '16px', lineHeight: '1.5' }}>
                    {prompt.content}
                  </p>
                  {votingMode && prompt.status === 'voting' ? (
                    <VotingUI 
                      promptId={prompt.id} 
                      voteCooldown={voteCooldown}
                      setVoteCooldown={setVoteCooldown}
                      setEloToast={setEloToast}
                    />
                  ) : (
                    <div>
                      <textarea
                        value={submissionTexts.get(prompt.id) || ''}
                        onChange={(e) => setSubmissionTexts(new Map(submissionTexts.set(prompt.id, e.target.value)))}
                        placeholder="Write your response here..."
                        style={{
                          width: '100%',
                          minHeight: '120px',
                          padding: '12px',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                          marginBottom: '12px'
                        }}
                      />
                      <button
                        onClick={() => handleSubmitSubmission(prompt.id)}
                        disabled={submitting.get(prompt.id) || !submissionTexts.get(prompt.id)?.trim()}
                        style={{
                          background: 'var(--green)',
                          color: 'white',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: (submitting.get(prompt.id) || !submissionTexts.get(prompt.id)?.trim()) ? 'not-allowed' : 'pointer',
                          opacity: (submitting.get(prompt.id) || !submissionTexts.get(prompt.id)?.trim()) ? 0.5 : 1
                        }}
                      >
                        {submitting.get(prompt.id) ? 'Submitting...' : 'Submit Response'}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>
              Class Leaderboard
            </h2>
            {leaderboard.length === 0 ? (
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '48px',
                textAlign: 'center',
                color: 'var(--text-secondary)'
              }}>
                No students have joined this class yet.
              </div>
            ) : (
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                {/* Column Headers */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr auto auto',
                  gap: '16px',
                  padding: '16px 24px',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--surface)'
                }}>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    fontFamily: 'var(--font-display)', 
                    color: 'var(--text2)', 
                    letterSpacing: '0.5px', 
                    textTransform: 'uppercase'
                  }}>
                    #
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    fontFamily: 'var(--font-display)', 
                    color: 'var(--text2)', 
                    letterSpacing: '0.5px', 
                    textTransform: 'uppercase'
                  }}>
                    Username
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    fontFamily: 'var(--font-display)', 
                    color: 'var(--text2)', 
                    letterSpacing: '0.5px', 
                    textTransform: 'uppercase',
                    textAlign: 'right'
                  }}>
                    ELO
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    fontFamily: 'var(--font-display)', 
                    color: 'var(--text2)',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    textAlign: 'center'
                  }}>
                    Rank
                  </div>
                </div>

                {/* Leaderboard Entries */}
                {leaderboard.map((entry, index) => {
                  const rank = index + 1
                  const rankColor = getRankColor(entry.rank)
                  
                  return (
                    <div
                      key={entry.user_id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '48px 1fr auto auto',
                        gap: '16px',
                        padding: '16px 24px',
                        borderBottom: index < leaderboard.length - 1 ? '1px solid var(--border)' : 'none',
                        background: getRankFaintColor(entry.rank),
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {/* Rank Number */}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: rank <= 3 ? 'linear-gradient(135deg, var(--gold), #f59e0b)' : 'var(--surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '800',
                        fontFamily: 'var(--font-display)',
                        color: rank <= 3 ? '#fff' : 'var(--text2)'
                      }}>
                        {rank}
                      </div>

                      {/* Username */}
                      <a
                        href={`/profile/${entry.username}`}
                        style={{
                          textDecoration: 'none',
                          fontSize: '16px',
                          fontWeight: '700',
                          fontFamily: 'var(--font-display)',
                          color: 'var(--text)',
                          letterSpacing: '-0.1px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        @{entry.username}
                      </a>

                      {/* ELO Score */}
                      <div style={{
                        fontSize: '18px',
                        fontWeight: '800',
                        fontFamily: 'var(--font-display)',
                        color: 'var(--green)',
                        letterSpacing: '-0.2px',
                        textAlign: 'right'
                      }}>
                        {entry.elo}
                      </div>

                      {/* Rank Title */}
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        fontFamily: 'var(--font-display)',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        background: getRankFaintColor(entry.rank),
                        color: rankColor,
                        border: `1px solid ${rankColor}20`,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        textAlign: 'center'
                      }}>
                        {entry.rank}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'past' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>
              Past Prompts
            </h2>
            {pastPrompts.length === 0 ? (
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '48px',
                textAlign: 'center',
                color: 'var(--text-secondary)'
              }}>
                No past prompts
              </div>
            ) : (
              pastPrompts.map(prompt => (
                <div key={prompt.id} style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '16px',
                  opacity: 0.8
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                        {prompt.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {getModeBadge(prompt.mode)}
                        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                          Completed
                        </span>
                      </div>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text)', marginBottom: '16px', lineHeight: '1.5' }}>
                    {prompt.content}
                  </p>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {prompt.submission_count} submissions
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ELO Toast */}
      {eloToast && (
        <div style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          background: 'var(--green)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 600,
          fontFamily: 'var(--font-display)',
          boxShadow: 'var(--shadow)',
          zIndex: 1000,
          animation: 'slideInRight 0.3s ease'
        }}>
          {eloToast.message}
        </div>
      )}
    </div>
  )
}
