'use client'

// Class management component for teachers
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

interface ClassData {
  id: string
  teacher_id: string
  name: string
  school_name: string
  teacher_name: string
  role: string
  join_code: string
  student_count: number
  created_at: string
}

interface Student {
  id: string
  user_id: string
  username: string
  display_name?: string
  elo: number
  rank: string
  streak: number
  joined_at: string
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
  username: string
}

interface LeaderboardEntry {
  user_id: string
  username: string
  total_elo_earned: number
  global_rank: string
}

interface ClassManagementClientProps {
  classData: ClassData
}

export default function ClassManagementClient({ classData }: ClassManagementClientProps) {
  const router = useRouter()
  const supabase = createClient()

  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'prompts' | 'leaderboard' | 'live'>('overview')
  const [students, setStudents] = useState<Student[]>([])
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [liveSubmissions, setLiveSubmissions] = useState<Submission[]>([])
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)

  // Form states
  const [showCreatePromptForm, setShowCreatePromptForm] = useState(false)
  const [promptFormData, setPromptFormData] = useState({
    title: '',
    content: '',
    mode: 'bellringer' as 'bellringer' | 'competition',
    time_setting: 'scheduled' as 'scheduled' | 'live',
    start_time: '',
    end_time: '',
    duration_minutes: 10
  })

  // Fetch data on component mount and tab changes
  useEffect(() => {
    fetchTabData()
  }, [activeTab])

  // Countdown timer for live sessions
  useEffect(() => {
    if (!activePrompt || activePrompt.status !== 'active' || !activePrompt.end_time) {
      setTimeRemaining(0)
      return
    }

    const updateCountdown = () => {
      const now = new Date()
      const endTime = new Date(activePrompt.end_time!)
      const diff = endTime.getTime() - now.getTime()
      
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
  }, [activePrompt])

  const handleAutoStatusChange = async () => {
    if (!activePrompt) return

    try {
      if (activePrompt.mode === 'competition') {
        // Competition: set to voting
        await supabase
          .from('class_prompts')
          .update({ status: 'voting' })
          .eq('id', activePrompt.id)
      } else {
        // Bellringer: set to completed
        await supabase
          .from('class_prompts')
          .update({ status: 'completed' })
          .eq('id', activePrompt.id)
      }

      // Refresh the active prompt
      await fetchLiveSession()
    } catch (error) {
      console.error('Error auto-changing status:', error)
    }
  }

  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Set up realtime for live submissions
  useEffect(() => {
    if (activeTab === 'live') {
      const channel = supabase
        .channel('live-submissions')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'class_submissions',
            filter: `class_id=eq.${classData.id}`
          },
          (payload) => {
            const newSubmission = payload.new as Submission
            setLiveSubmissions(prev => [newSubmission, ...prev])
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [activeTab, classData.id])

  const fetchTabData = async () => {
    setLoading(true)
    
    try {
      switch (activeTab) {
        case 'overview':
          await fetchStudents()
          break
        case 'prompts':
          await fetchPrompts()
          break
        case 'leaderboard':
          await fetchLeaderboard()
          break
        case 'live':
          await fetchLiveSession()
          break
      }
    } catch (error) {
      console.error('Error fetching tab data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      // Fetch class members
      const { data: members, error: membersError } = await supabase
        .from('class_members')
        .select('*')
        .eq('class_id', classData.id)

      if (membersError) throw membersError

      if (!members || members.length === 0) {
        setStudents([])
        return
      }

      // Fetch profiles for all students
      const userIds = members.map(m => m.user_id)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, display_name')
        .in('id', userIds)

      if (profilesError) throw profilesError

      // Fetch ELO data for all students
      const { data: eloData, error: eloError } = await supabase
        .from('user_stats')
        .select('user_id, elo')
        .in('user_id', userIds)

      if (eloError) throw eloError

      // Fetch streak data
      const { data: streakData, error: streakError } = await supabase
        .from('daily_streaks')
        .select('user_id, current_streak')
        .in('user_id', userIds)

      if (streakError) throw streakError

      // Merge data
      const studentsData: Student[] = members.map(member => {
        const profile = profiles?.find(p => p.id === member.user_id)
        const elo = eloData?.find(e => e.user_id === member.user_id)?.elo || 0
        const streak = streakData?.find(s => s.user_id === member.user_id)?.current_streak || 0
        
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
          id: member.id,
          user_id: member.user_id,
          username: profile?.username || 'Unknown',
          display_name: profile?.display_name,
          elo,
          rank,
          streak,
          joined_at: member.joined_at
        }
      })

      setStudents(studentsData)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('class_prompts')
        .select('*')
        .eq('class_id', classData.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPrompts(data || [])
    } catch (error) {
      console.error('Error fetching prompts:', error)
    }
  }

  const fetchLeaderboard = async () => {
    try {
      // Fetch class ELO history
      const { data: eloHistory, error: eloError } = await supabase
        .from('class_elo_history')
        .select('user_id, elo_change')
        .eq('class_id', classData.id)

      if (eloError) throw eloError

      if (!eloHistory || eloHistory.length === 0) {
        setLeaderboard([])
        return
      }

      // Calculate total ELO earned per user
      const eloMap = new Map<string, number>()
      eloHistory.forEach(entry => {
        const current = eloMap.get(entry.user_id) || 0
        eloMap.set(entry.user_id, current + entry.elo_change)
      })

      // Fetch user profiles and global ELO for rankings
      const userIds = Array.from(eloMap.keys())
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', userIds)

      if (profilesError) throw profilesError

      const { data: globalElo, error: globalEloError } = await supabase
        .from('user_stats')
        .select('user_id, elo')
        .in('user_id', userIds)

      if (globalEloError) throw globalEloError

      // Create leaderboard entries
      const leaderboardEntries: LeaderboardEntry[] = Array.from(eloMap.entries())
        .map(([userId, totalElo]) => {
          const profile = profiles?.find(p => p.id === userId)
          const globalEloValue = globalElo?.find(e => e.user_id === userId)?.elo || 0
          
          // Calculate global rank
          let globalRank = 'Trainee'
          if (globalEloValue >= 2000) globalRank = 'Unicorn'
          else if (globalEloValue >= 1750) globalRank = 'Titan'
          else if (globalEloValue >= 1500) globalRank = 'Icon'
          else if (globalEloValue >= 1250) globalRank = 'Visionary'
          else if (globalEloValue >= 1000) globalRank = 'Founder'
          else if (globalEloValue >= 750) globalRank = 'Creator'
          else if (globalEloValue >= 500) globalRank = 'Builder'

          return {
            user_id: userId,
            username: profile?.username || 'Unknown',
            total_elo_earned: totalElo,
            global_rank: globalRank
          }
        })
        .sort((a, b) => b.total_elo_earned - a.total_elo_earned)

      setLeaderboard(leaderboardEntries)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    }
  }

  const fetchLiveSession = async () => {
    try {
      // Find active live prompt
      const { data: activePromptData, error: promptError } = await supabase
        .from('class_prompts')
        .select('*')
        .eq('class_id', classData.id)
        .eq('is_live', true)
        .eq('status', 'active')
        .single()

      if (promptError && promptError.code !== 'PGRST116') {
        throw promptError
      }

      setActivePrompt(activePromptData || null)

      if (activePromptData) {
        // Fetch existing submissions
        const { data: submissions, error: submissionsError } = await supabase
          .from('class_submissions')
          .select('*, profiles!inner(username)')
          .eq('prompt_id', activePromptData.id)
          .order('submitted_at', { ascending: false })

        if (submissionsError) throw submissionsError
        setLiveSubmissions(submissions || [])
      } else {
        setLiveSubmissions([])
      }
    } catch (error) {
      console.error('Error fetching live session:', error)
    }
  }

  const handleRemoveStudent = async (memberId: string, userId: string) => {
    try {
      // Remove from class_members
      await supabase
        .from('class_members')
        .delete()
        .eq('id', memberId)

      // Update student count
      await supabase
        .from('classes')
        .update({ student_count: Math.max(0, classData.student_count - 1) })
        .eq('id', classData.id)

      // Refresh students list
      await fetchStudents()
    } catch (error) {
      console.error('Error removing student:', error)
    }
  }

  const handleCreatePrompt = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const promptData: any = {
        class_id: classData.id,
        title: promptFormData.title,
        content: promptFormData.content,
        mode: promptFormData.mode,
        is_live: promptFormData.time_setting === 'live',
        status: promptFormData.time_setting === 'live' ? 'active' : 'scheduled'
      }

      if (promptFormData.time_setting === 'scheduled') {
        promptData.start_time = promptFormData.start_time
        promptData.end_time = promptFormData.end_time
      } else {
        promptData.duration_minutes = promptFormData.duration_minutes
        const now = new Date()
        const endTime = new Date(now.getTime() + promptFormData.duration_minutes * 60000)
        promptData.start_time = now.toISOString()
        promptData.end_time = endTime.toISOString()
      }

      const { data: newPrompt, error } = await supabase
        .from('class_prompts')
        .insert(promptData)
        .select()
        .single()

      if (error) throw error

      // Notify all students in the class about the new prompt
      if (newPrompt) {
        // Fetch all students in this class
        const { data: classMembers } = await supabase
          .from('class_members')
          .select('user_id')
          .eq('class_id', classData.id)

        if (classMembers && classMembers.length > 0) {
          // Create notifications for all students
          const notifications = classMembers.map(member => ({
            user_id: member.user_id,
            type: 'class_prompt',
            title: `New prompt in ${classData.name}`,
            body: newPrompt.title,
            reference_id: newPrompt.id,
            reference_type: 'class_prompt',
            read: false
          }))

          await supabase
            .from('notifications')
            .insert(notifications)
        }
      }

      // Reset form and refresh prompts
      setShowCreatePromptForm(false)
      setPromptFormData({
        title: '',
        content: '',
        mode: 'bellringer',
        time_setting: 'scheduled',
        start_time: '',
        end_time: '',
        duration_minutes: 10
      })
      await fetchPrompts()
    } catch (error) {
      console.error('Error creating prompt:', error)
    }
  }

  const handleEndSubmissions = async () => {
    if (!activePrompt) return

    try {
      await supabase
        .from('class_prompts')
        .update({ status: 'voting' })
        .eq('id', activePrompt.id)

      await fetchLiveSession()
    } catch (error) {
      console.error('Error ending submissions:', error)
    }
  }

  const handleEndSession = async () => {
    if (!activePrompt) return

    try {
      if (activePrompt.mode === 'competition') {
        // Call distribute prizes function
        const { error } = await supabase
          .rpc('distribute_class_prizes', { prompt_id: activePrompt.id })

        if (error) throw error

        // Fetch all students who submitted to this competition
        const { data: submissions } = await supabase
          .from('class_submissions')
          .select('user_id')
          .eq('prompt_id', activePrompt.id)

        if (submissions && submissions.length > 0) {
          // Fetch ELO changes for this competition
          const { data: eloChanges } = await supabase
            .from('class_elo_history')
            .select('user_id, elo_change')
            .eq('class_id', classData.id)
            .eq('prompt_id', activePrompt.id)

          const eloMap = new Map(
            eloChanges?.map(change => [change.user_id, change.elo_change]) || []
          )

          // Create notifications for each student
          const notifications = submissions.map(submission => {
            const eloChange = eloMap.get(submission.user_id) || 0
            let placement = 'Participated'
            if (eloChange >= 15) placement = '1st Place'
            else if (eloChange >= 10) placement = '2nd Place'
            else if (eloChange >= 5) placement = '3rd Place'

            return {
              user_id: submission.user_id,
              type: 'class_results',
              title: `Results are in for ${activePrompt.title}`,
              body: `${placement} - ${eloChange > 0 ? '+' : ''}${eloChange} ELO`,
              reference_id: activePrompt.id,
              reference_type: 'class_results',
              read: false
            }
          })

          await supabase
            .from('notifications')
            .insert(notifications)
        }
      }

      await supabase
        .from('class_prompts')
        .update({ status: 'completed' })
        .eq('id', activePrompt.id)

      await fetchLiveSession()
    } catch (error) {
      console.error('Error ending session:', error)
    }
  }

  const [copyButtonText, setCopyButtonText] = useState('Copy')

  const copyJoinCode = async () => {
    try {
      await navigator.clipboard.writeText(classData.join_code)
      setCopyButtonText('Copied!')
      setTimeout(() => {
        setCopyButtonText('Copy')
      }, 2000)
    } catch (error) {
      console.error('Error copying join code:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      scheduled: 'var(--blue)',
      active: 'var(--green)',
      voting: 'var(--orange)',
      completed: 'var(--text2)'
    }
    
    return (
      <span style={{
        background: colors[status as keyof typeof colors],
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase'
      }}>
        {status}
      </span>
    )
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'var(--bg)',
        backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        padding: '40px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            background: 'var(--border)',
            width: '300px',
            height: '48px',
            borderRadius: '8px',
            marginBottom: '32px'
          }} />
          <div style={{ 
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '32px',
            height: '600px'
          }} />
        </div>
      </div>
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
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => router.push('/schools')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text2)',
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '16px',
              fontFamily: 'var(--font-body)'
            }}
          >
            &larr; Back to Classes
          </button>
          
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 800, 
            letterSpacing: '-2px', 
            fontFamily: 'var(--font-display)', 
            color: 'var(--text)', 
            marginBottom: '16px'
          }}>
            {classData.name}
          </h1>
          
          <div style={{ fontSize: '16px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
            {classData.school_name}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid var(--border)', 
          marginBottom: '32px' 
        }}>
          {(['overview', 'prompts', 'leaderboard', 'live'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '16px 24px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--green)' : 'none',
                color: activeTab === tab ? 'var(--text)' : 'var(--text2)',
                fontSize: '16px',
                fontWeight: 600,
                fontFamily: 'var(--font-display)',
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
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '32px'
        }}>
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: 700, 
                marginBottom: '24px',
                fontFamily: 'var(--font-display)',
                color: 'var(--text)'
              }}>
                Class Overview
              </h2>

              {/* Class Info */}
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '8px' }}>
                      Class Name
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                      {classData.name}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '8px' }}>
                      School
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                      {classData.school_name}
                    </div>
                  </div>
                </div>

                <div style={{ 
                  height: '1px', 
                  background: 'var(--border)', 
                  margin: '24px 0' 
                }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '8px' }}>
                      Join Code
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ 
                        fontSize: '24px', 
                        fontWeight: 800, 
                        fontFamily: 'monospace',
                        letterSpacing: '2px',
                        background: 'var(--green-tint)',
                        color: 'var(--green)',
                        padding: '8px 16px',
                        borderRadius: '8px'
                      }}>
                        {classData.join_code}
                      </span>
                      <button
                        onClick={copyJoinCode}
                        style={{
                          padding: '8px 16px',
                          background: copyButtonText === 'Copied!' ? 'var(--green-tint)' : 'var(--green)',
                          color: copyButtonText === 'Copied!' ? 'var(--green)' : 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'var(--font-display)'
                        }}
                      >
                        {copyButtonText}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '8px' }}>
                      Total Students
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                      {classData.student_count}
                    </div>
                  </div>
                </div>
              </div>

              {/* Students List */}
              <div>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 600, 
                  marginBottom: '16px',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text)'
                }}>
                  Students ({students.length})
                </h3>

                {students.length === 0 ? (
                  <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '48px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}> students </div>
                    <p style={{ color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                      No students have joined this class yet. Share the join code to get started!
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {students.map((student) => (
                      <div key={student.id} style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                              @{student.username}
                            </div>
                            {student.display_name && (
                              <div style={{ fontSize: '14px', color: 'var(--text2)' }}>
                                {student.display_name}
                              </div>
                            )}
                          </div>
                          
                          <div style={{ fontSize: '14px', color: 'var(--text2)' }}>
                            ELO: {student.elo}
                          </div>
                          
                          <div style={{ fontSize: '14px', color: 'var(--text2)' }}>
                            Rank: {student.rank}
                          </div>
                          
                          <div style={{ fontSize: '14px', color: 'var(--text2)' }}>
                            Streak: {student.streak} days
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveStudent(student.id, student.user_id)}
                          style={{
                            padding: '8px 16px',
                            background: 'var(--red)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-display)'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'prompts' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 700, 
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text)'
                }}>
                  Prompts
                </h2>
                
                <button
                  onClick={() => setShowCreatePromptForm(true)}
                  style={{
                    padding: '12px 24px',
                    background: 'var(--green)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-display)'
                  }}
                >
                  Create New Prompt
                </button>
              </div>

              {/* Create Prompt Form Modal */}
              {showCreatePromptForm && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
                }}>
                  <div style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '32px',
                    maxWidth: '600px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                  }}>
                    <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: 700, 
                      marginBottom: '24px',
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text)'
                    }}>
                      Create New Prompt
                    </h3>
                    
                    <form onSubmit={handleCreatePrompt}>
                      <div style={{ marginBottom: '20px' }}>
                        <input
                          type="text"
                          placeholder="Prompt title"
                          value={promptFormData.title}
                          onChange={(e) => setPromptFormData({...promptFormData, title: e.target.value})}
                          required
                          style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '14px',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            background: 'var(--surface)',
                            color: 'var(--text)',
                            fontFamily: 'var(--font-body)',
                            marginBottom: '12px'
                          }}
                        />
                        
                        <textarea
                          placeholder="Prompt content/question"
                          value={promptFormData.content}
                          onChange={(e) => setPromptFormData({...promptFormData, content: e.target.value})}
                          required
                          rows={4}
                          style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '14px',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            background: 'var(--surface)',
                            color: 'var(--text)',
                            fontFamily: 'var(--font-body)',
                            marginBottom: '12px',
                            resize: 'vertical'
                          }}
                        />
                        
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                            Mode
                          </label>
                          <div style={{ display: 'flex', gap: '16px' }}>
                            {(['bellringer', 'competition'] as const).map((mode) => (
                              <label key={mode} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                  type="radio"
                                  name="mode"
                                  value={mode}
                                  checked={promptFormData.mode === mode}
                                  onChange={(e) => setPromptFormData({...promptFormData, mode: e.target.value as 'bellringer' | 'competition'})}
                                  style={{ marginRight: '8px' }}
                                />
                                <span style={{ textTransform: 'capitalize' }}>{mode}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                            Time Setting
                          </label>
                          <div style={{ display: 'flex', gap: '16px' }}>
                            {(['scheduled', 'live'] as const).map((setting) => (
                              <label key={setting} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                  type="radio"
                                  name="time_setting"
                                  value={setting}
                                  checked={promptFormData.time_setting === setting}
                                  onChange={(e) => setPromptFormData({...promptFormData, time_setting: e.target.value as 'scheduled' | 'live'})}
                                  style={{ marginRight: '8px' }}
                                />
                                <span style={{ textTransform: 'capitalize' }}>{setting}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        {promptFormData.time_setting === 'scheduled' ? (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                              <label style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', display: 'block' }}>
                                Start Time
                              </label>
                              <input
                                type="datetime-local"
                                value={promptFormData.start_time}
                                onChange={(e) => setPromptFormData({...promptFormData, start_time: e.target.value})}
                                required
                                style={{
                                  width: '100%',
                                  padding: '12px',
                                  fontSize: '14px',
                                  border: '1px solid var(--border)',
                                  borderRadius: '6px',
                                  background: 'var(--surface)',
                                  color: 'var(--text)',
                                  fontFamily: 'var(--font-body)'
                                }}
                              />
                            </div>
                            
                            <div>
                              <label style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', display: 'block' }}>
                                End Time
                              </label>
                              <input
                                type="datetime-local"
                                value={promptFormData.end_time}
                                onChange={(e) => setPromptFormData({...promptFormData, end_time: e.target.value})}
                                required
                                style={{
                                  width: '100%',
                                  padding: '12px',
                                  fontSize: '14px',
                                  border: '1px solid var(--border)',
                                  borderRadius: '6px',
                                  background: 'var(--surface)',
                                  color: 'var(--text)',
                                  fontFamily: 'var(--font-body)'
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', display: 'block' }}>
                              Duration (minutes)
                            </label>
                            <select
                              value={promptFormData.duration_minutes}
                              onChange={(e) => setPromptFormData({...promptFormData, duration_minutes: parseInt(e.target.value)})}
                              style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '14px',
                                border: '1px solid var(--border)',
                                borderRadius: '6px',
                                background: 'var(--surface)',
                                color: 'var(--text)',
                                fontFamily: 'var(--font-body)'
                              }}
                            >
                              <option value={5}>5 minutes</option>
                              <option value={10}>10 minutes</option>
                              <option value={15}>15 minutes</option>
                              <option value={20}>20 minutes</option>
                              <option value={30}>30 minutes</option>
                            </select>
                          </div>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          type="submit"
                          style={{
                            flex: 1,
                            padding: '12px',
                            background: 'var(--green)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-display)'
                          }}
                        >
                          Create Prompt
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setShowCreatePromptForm(false)
                            setPromptFormData({
                              title: '',
                              content: '',
                              mode: 'bellringer',
                              time_setting: 'scheduled',
                              start_time: '',
                              end_time: '',
                              duration_minutes: 10
                            })
                          }}
                          style={{
                            flex: 1,
                            padding: '12px',
                            background: 'var(--surface)',
                            color: 'var(--text)',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-display)'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Prompts List */}
              {prompts.length === 0 ? (
                <div style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '48px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}> create </div>
                  <p style={{ color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                    No prompts created yet. Create your first prompt to get started!
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {prompts.map((prompt) => (
                    <div key={prompt.id} style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.boxShadow = 'var(--shadow)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h3 style={{ 
                            fontSize: '18px', 
                            fontWeight: 600, 
                            margin: 0,
                            fontFamily: 'var(--font-display)',
                            color: 'var(--text)'
                          }}>
                            {prompt.title}
                          </h3>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                            {getStatusBadge(prompt.status)}
                            <span style={{ 
                              fontSize: '12px', 
                              color: 'var(--text2)',
                              textTransform: 'capitalize'
                            }}>
                              {prompt.mode}
                            </span>
                            {prompt.is_live && (
                              <span style={{ 
                                fontSize: '12px', 
                                color: 'var(--green)',
                                fontWeight: 600
                              }}>
                                LIVE
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '14px', color: 'var(--text2)' }}>
                            {prompt.submission_count} submissions
                          </div>
                        </div>
                      </div>
                      
                      <p style={{ 
                        color: 'var(--text2)', 
                        fontSize: '14px',
                        fontFamily: 'var(--font-body)',
                        margin: '12px 0 0 0',
                        lineHeight: '1.4'
                      }}>
                        {prompt.content.length > 100 ? prompt.content.substring(0, 100) + '...' : prompt.content}
                      </p>
                      
                      {(prompt.start_time || prompt.end_time) && (
                        <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '8px' }}>
                          {prompt.start_time && `Start: ${new Date(prompt.start_time).toLocaleString()}`}
                          {prompt.start_time && prompt.end_time && ' | '}
                          {prompt.end_time && `End: ${new Date(prompt.end_time).toLocaleString()}`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: 700, 
                marginBottom: '24px',
                fontFamily: 'var(--font-display)',
                color: 'var(--text)'
              }}>
                Class Leaderboard
              </h2>

              {leaderboard.length === 0 ? (
                <div style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '48px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}> trophy </div>
                  <p style={{ color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                    No competition data yet. Complete some competitions to see the leaderboard!
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {leaderboard.map((entry, index) => (
                    <div key={entry.user_id} style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: 800,
                        fontFamily: 'var(--font-display)',
                        color: index === 0 ? 'var(--gold)' : index === 1 ? 'var(--text2)' : index === 2 ? '#cd7f32' : 'var(--text3)',
                        width: '40px',
                        textAlign: 'center'
                      }}>
                        #{index + 1}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: 600, 
                          fontFamily: 'var(--font-display)',
                          cursor: 'pointer'
                        }}
                        onClick={() => router.push(`/profile/${entry.username}`)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--green)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text)'
                        }}>
                          @{entry.username}
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text2)' }}>
                          Global Rank: {entry.global_rank}
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          fontSize: '20px', 
                          fontWeight: 700, 
                          fontFamily: 'var(--font-display)',
                          color: 'var(--green)'
                        }}>
                          +{entry.total_elo_earned}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text2)' }}>
                          Class ELO
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'live' && (
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: 700, 
                marginBottom: '24px',
                fontFamily: 'var(--font-display)',
                color: 'var(--text)'
              }}>
                Live Session
              </h2>

              {!activePrompt ? (
                <div style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '48px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}> live </div>
                  <p style={{ color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                    No active live session. Create a live prompt to get started!
                  </p>
                </div>
              ) : (
                <div>
                  {/* Active Prompt Info */}
                  <div style={{
                    background: 'var(--green-tint)',
                    border: '1px solid var(--green)',
                    borderRadius: '8px',
                    padding: '24px',
                    marginBottom: '24px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ 
                          fontSize: '20px', 
                          fontWeight: 700, 
                          margin: '0 0 8px 0',
                          fontFamily: 'var(--font-display)',
                          color: 'var(--green)'
                        }}>
                          {activePrompt.title}
                        </h3>
                        <p style={{ 
                          color: 'var(--text)',
                          fontFamily: 'var(--font-body)',
                          margin: 0,
                          lineHeight: '1.4'
                        }}>
                          {activePrompt.content}
                        </p>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        {activePrompt.status === 'active' && timeRemaining > 0 ? (
                          <div>
                            <div style={{ 
                              fontSize: '32px', 
                              fontWeight: 800, 
                              color: 'var(--red)',
                              fontFamily: 'var(--font-display)'
                            }}>
                              {formatTimeRemaining(timeRemaining)}
                            </div>
                            <div style={{ fontSize: '14px', color: 'var(--text2)' }}>
                              Time Remaining
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--green)' }}>
                              {liveSubmissions.length}
                            </div>
                            <div style={{ fontSize: '14px', color: 'var(--text2)' }}>
                              Submissions
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <button
                      onClick={handleEndSubmissions}
                      style={{
                        flex: 1,
                        padding: '16px',
                        background: 'var(--orange)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-display)'
                      }}
                    >
                      End Submissions & Start Voting
                    </button>
                    
                    <button
                      onClick={handleEndSession}
                      style={{
                        flex: 1,
                        padding: '16px',
                        background: 'var(--red)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-display)'
                      }}
                    >
                      End Session
                    </button>
                  </div>

                  {/* Live Submissions Feed */}
                  <div>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: 600, 
                      marginBottom: '16px',
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text)'
                    }}>
                      Live Submissions
                    </h3>
                    
                    {liveSubmissions.length === 0 ? (
                      <div style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '32px',
                        textAlign: 'center'
                      }}>
                        <p style={{ color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                          Waiting for submissions...
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                        {liveSubmissions.map((submission) => (
                          <div key={submission.id} style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: '16px',
                            animation: 'slideIn 0.3s ease'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                              <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                                @{submission.username}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--text2)' }}>
                                {new Date(submission.submitted_at).toLocaleTimeString()}
                              </div>
                            </div>
                            <p style={{ 
                              color: 'var(--text)',
                              fontFamily: 'var(--font-body)',
                              margin: 0,
                              lineHeight: '1.4'
                            }}>
                              {submission.submission_text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
