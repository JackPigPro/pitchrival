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
  teacher_name: string
  role: string
  join_code: string
  student_count: number
  created_at: string
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
  total_elo_earned: number
}

interface StudentClassClientProps {
  classData: ClassData
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
  const [teacherProfile, setTeacherProfile] = useState<{ username: string } | null>(null)
  const [loading, setLoading] = useState(true)

  // Form states
  const [submissionTexts, setSubmissionTexts] = useState<Map<string, string>>(new Map())
  const [submitting, setSubmitting] = useState<Map<string, boolean>>(new Map())

  // Fetch data on component mount and tab changes
  useEffect(() => {
    fetchTabData()
  }, [activeTab])

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

  // Fetch teacher profile
  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', classData.teacher_id)
          .single()
        
        setTeacherProfile(profile)
      } catch (error) {
        console.error('Error fetching teacher profile:', error)
      }
    }

    fetchTeacherProfile()
  }, [classData.teacher_id])

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

      // Fetch user profiles
      const userIds = Array.from(eloMap.keys())
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', userIds)

      if (profilesError) throw profilesError

      // Create leaderboard entries
      const leaderboardEntries: LeaderboardEntry[] = Array.from(eloMap.entries())
        .map(([userId, totalElo]) => {
          const profile = profiles?.find(p => p.id === userId)
          return {
            user_id: userId,
            username: profile?.username || 'Unknown',
            total_elo_earned: totalElo
          }
        })
        .sort((a, b) => b.total_elo_earned - a.total_elo_earned)

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
      // Remove from class_members
      await supabase
        .from('class_members')
        .delete()
        .eq('user_id', user.id)
        .eq('class_id', classData.id)

      // Update student count
      await supabase
        .from('classes')
        .update({ student_count: Math.max(0, classData.student_count - 1) })
        .eq('id', classData.id)

      router.push('/schools')
    } catch (error) {
      console.error('Error leaving class:', error)
    }
  }

  const getTimeRemaining = (endTime?: string) => {
    if (!endTime) return 'No end time'
    
    const now = new Date()
    const end = new Date(endTime)
    const diff = end.getTime() - now.getTime()
    
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
        {/* Class Header */}
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h1 style={{ 
                fontSize: '36px', 
                fontWeight: 800, 
                letterSpacing: '-1px', 
                fontFamily: 'var(--font-display)', 
                color: 'var(--text)', 
                marginBottom: '8px'
              }}>
                {classData.name}
              </h1>
              <div style={{ fontSize: '16px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                {teacherProfile ? `Teacher: @${teacherProfile.username}` : 'Loading teacher...'}
              </div>
              <div style={{ fontSize: '16px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                {classData.school_name}
              </div>
            </div>
            
            <button
              onClick={handleLeaveClass}
              style={{
                padding: '12px 24px',
                background: 'var(--red)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-display)'
              }}
            >
              Leave Class
            </button>
          </div>
          
          <div style={{ fontSize: '14px', color: 'var(--text2)' }}>
            {classData.student_count} students in this class
          </div>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid var(--border)', 
          marginBottom: '32px' 
        }}>
          {(['prompts', 'leaderboard', 'past'] as const).map((tab) => (
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
                transition: 'all 0.2s ease'
              }}
            >
              {tab === 'prompts' ? "Today's Prompts" : tab.charAt(0).toUpperCase() + tab.slice(1)}
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
          {activeTab === 'prompts' && (
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: 700, 
                marginBottom: '24px',
                fontFamily: 'var(--font-display)',
                color: 'var(--text)'
              }}>
                Today's Prompts
              </h2>

              {activePrompts.length === 0 ? (
                <div style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '48px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}> assignment </div>
                  <p style={{ color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                    No active prompts right now. Check back soon!
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {activePrompts.map((prompt) => {
                    const userSubmission = userSubmissions.get(prompt.id)
                    const isSubmitting = submitting.get(prompt.id) || false
                    const submissionText = submissionTexts.get(prompt.id) || ''

                    return (
                      <div key={prompt.id} style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '24px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ 
                              fontSize: '20px', 
                              fontWeight: 600, 
                              marginBottom: '8px',
                              fontFamily: 'var(--font-display)',
                              color: 'var(--text)'
                            }}>
                              {prompt.title}
                            </h3>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                              {getModeBadge(prompt.mode)}
                              <span style={{ fontSize: '14px', color: 'var(--text2)' }}>
                                {getTimeRemaining(prompt.end_time)}
                              </span>
                              <span style={{ fontSize: '14px', color: 'var(--text2)' }}>
                                {prompt.submission_count} submissions
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p style={{ 
                          color: 'var(--text)', 
                          fontFamily: 'var(--font-body)',
                          marginBottom: '20px',
                          lineHeight: '1.6'
                        }}>
                          {prompt.content}
                        </p>

                        {!userSubmission ? (
                          <div>
                            <textarea
                              value={submissionText}
                              onChange={(e) => setSubmissionTexts(prev => new Map(prev.set(prompt.id, e.target.value)))}
                              placeholder="Enter your response..."
                              disabled={isSubmitting}
                              style={{
                                width: '100%',
                                minHeight: '120px',
                                padding: '16px',
                                fontSize: '14px',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                background: 'var(--bg)',
                                color: 'var(--text)',
                                fontFamily: 'var(--font-body)',
                                resize: 'vertical',
                                marginBottom: '16px'
                              }}
                            />
                            <button
                              onClick={() => handleSubmitSubmission(prompt.id)}
                              disabled={isSubmitting || !submissionText.trim()}
                              style={{
                                padding: '12px 24px',
                                background: isSubmitting || !submissionText.trim() ? 'var(--border)' : 'var(--green)',
                                color: isSubmitting || !submissionText.trim() ? 'var(--text2)' : 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 600,
                                cursor: isSubmitting || !submissionText.trim() ? 'not-allowed' : 'pointer',
                                fontFamily: 'var(--font-display)'
                              }}
                            >
                              {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div style={{
                              background: 'var(--green-tint)',
                              border: '1px solid var(--green)',
                              borderRadius: '8px',
                              padding: '16px',
                              marginBottom: '16px'
                            }}>
                              <p style={{ 
                                color: 'var(--green)',
                                fontWeight: 600,
                                fontFamily: 'var(--font-display)',
                                margin: '0 0 8px 0'
                              }}>
                                Your Submission:
                              </p>
                              <p style={{ 
                                color: 'var(--text)',
                                fontFamily: 'var(--font-body)',
                                margin: 0,
                                lineHeight: '1.4'
                              }}>
                                {userSubmission.submission_text}
                              </p>
                            </div>
                            <button
                              style={{
                                padding: '12px 24px',
                                background: 'var(--blue)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: 'var(--font-display)'
                              }}
                            >
                              View Responses
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
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
                    No competition results yet
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {leaderboard.map((entry, index) => {
                    const isCurrentUser = entry.user_id === user?.id
                    return (
                      <div key={entry.user_id} style={{
                        background: isCurrentUser ? 'var(--green-tint)' : 'var(--surface)',
                        border: isCurrentUser ? '1px solid var(--green)' : '1px solid var(--border)',
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
                          {isCurrentUser && (
                            <div style={{ fontSize: '12px', color: 'var(--green)', fontWeight: 600 }}>
                              You
                            </div>
                          )}
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
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'past' && (
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: 700, 
                marginBottom: '24px',
                fontFamily: 'var(--font-display)',
                color: 'var(--text)'
              }}>
                Past Prompts
              </h2>

              {pastPrompts.length === 0 ? (
                <div style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '48px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}> history </div>
                  <p style={{ color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                    No past prompts yet
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {pastPrompts.map((prompt) => (
                    <div key={prompt.id} style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '20px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h3 style={{ 
                            fontSize: '18px', 
                            fontWeight: 600, 
                            marginBottom: '8px',
                            fontFamily: 'var(--font-display)',
                            color: 'var(--text)'
                          }}>
                            {prompt.title}
                          </h3>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            {getModeBadge(prompt.mode)}
                            <span style={{ fontSize: '14px', color: 'var(--text2)' }}>
                              {prompt.end_time ? new Date(prompt.end_time).toLocaleDateString() : 'No date'}
                            </span>
                            <span style={{ fontSize: '14px', color: 'var(--text2)' }}>
                              {prompt.submission_count} submissions
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {prompt.mode === 'competition' && (
                        <div style={{
                          background: 'var(--gold-tint)',
                          border: '1px solid var(--gold)',
                          borderRadius: '8px',
                          padding: '16px',
                          marginTop: '12px'
                        }}>
                          <p style={{ 
                            fontSize: '14px', 
                            fontWeight: 600,
                            fontFamily: 'var(--font-display)',
                            color: 'var(--gold)',
                            margin: '0 0 8px 0'
                          }}>
                            Top 3 Winners:
                          </p>
                          <div style={{ fontSize: '14px', color: 'var(--text2)' }}>
                            Winner: +15 ELO | Second: +10 ELO | Third: +5 ELO
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
