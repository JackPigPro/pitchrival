'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

interface DailyBattle {
  id: string
  prompt: string
  date: string
  created_at: string
}

interface UserSubmission {
  id: string
  content: string
  created_at: string
}

interface DailyStreak {
  current_streak: number
  longest_streak: number
  last_submission_date: string | null
}

interface Submission {
  id: string
  content: string
  username: string
  display_name: string
  created_at: string
  likes: number
  user_liked: boolean
}

interface DailyBattleClientProps {
  battle: DailyBattle
  userSubmission: UserSubmission | null
  userStreak: DailyStreak | null
  userId: string
}

export default function DailyBattleClient({ battle, userSubmission, userStreak, userId }: DailyBattleClientProps) {
  const { isAuthenticated, authLoading } = useUser()
  const [submission, setSubmission] = useState('')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const supabase = createClient()

  useEffect(() => {
    if (userSubmission) {
      fetchSubmissions()
    }
  }, [userSubmission])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/daily-battle/submissions?battleId=${battle.id}`)
      if (!response.ok) throw new Error('Failed to fetch submissions')
      const data = await response.json()
      setSubmissions(data)
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!submission.trim() || submission.length > 500) return

    try {
      setSubmitting(true)
      const response = await fetch('/api/daily-battle/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          battleId: battle.id,
          content: submission.trim()
        })
      })

      if (!response.ok) throw new Error('Failed to submit')

      const data = await response.json()
      setToastMessage(`+${data.eloGained} ELO`)
      setShowToast(true)
      
      // Clear submission and refresh
      setSubmission('')
      setTimeout(() => {
        fetchSubmissions()
      }, 1000)

      setTimeout(() => setShowToast(false), 3000)
    } catch (error) {
      console.error('Error submitting:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLike = async (submissionId: string, currentlyLiked: boolean) => {
    try {
      const response = await fetch('/api/daily-battle/likes', {
        method: currentlyLiked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId })
      })

      if (!response.ok) throw new Error('Failed to update like')

      // Update local state
      setSubmissions(prev => prev.map(sub => 
        sub.id === submissionId 
          ? { ...sub, likes: currentlyLiked ? sub.likes - 1 : sub.likes + 1, user_liked: !currentlyLiked }
          : sub
      ))
    } catch (error) {
      console.error('Error updating like:', error)
    }
  }

  const getStreakMessage = () => {
    if (!userStreak) return "Start your streak today!"
    if (userSubmission) return "Streak maintained! ✅"
    return "Submit today to keep your streak!"
  }

  const getStreakELO = (streak: number) => {
    if (streak === 0) return 0
    if (streak === 1) return 1
    if (streak <= 6) return 3
    return 5
  }

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div>Please log in to participate in daily battles</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {/* Toast */}
        {showToast && (
          <div style={{
            position: 'fixed',
            top: '80px',
            right: '32px',
            background: 'var(--green)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 'bold',
            zIndex: 1000,
            animation: 'slideIn 0.3s ease'
          }}>
            {toastMessage}
          </div>
        )}

        {/* Today's Prompt */}
        <div style={{
          background: 'var(--surface)',
          padding: '32px',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
            Today's Prompt
          </h2>
          <p style={{ fontSize: '24px', lineHeight: '1.4', color: 'var(--text-primary)' }}>
            {battle.prompt}
          </p>
        </div>

        {/* Not Submitted State */}
        {!userSubmission ? (
          <div style={{
            background: 'var(--surface)',
            padding: '32px',
            borderRadius: '12px'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <textarea
                value={submission}
                onChange={(e) => setSubmission(e.target.value.slice(0, 500))}
                placeholder="Share your response..."
                maxLength={500}
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '16px',
                  resize: 'vertical',
                  background: 'var(--background)',
                  color: 'var(--text-primary)'
                }}
              />
              <div style={{
                textAlign: 'right',
                marginTop: '8px',
                fontSize: '14px',
                color: 'var(--text-secondary)'
              }}>
                {submission.length}/500
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!submission.trim() || submitting}
              style={{
                background: submission.trim() && !submitting ? 'var(--green)' : 'var(--border)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: submission.trim() && !submitting ? 'pointer' : 'not-allowed',
                opacity: submission.trim() && !submitting ? 1 : 0.6
              }}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        ) : (
          /* Submitted State - Show Submissions */
          <div>
            {/* User's Submission */}
            <div style={{
              background: 'var(--surface)',
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '16px',
              border: '2px solid var(--green)'
            }}>
              <div style={{ marginBottom: '12px' }}>
                <Link href={`/profile/${userId}`} style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--green)' }}>Your Submission</span>
                </Link>
              </div>
              <p style={{ fontSize: '16px', lineHeight: '1.4', marginBottom: '12px' }}>
                {userSubmission.content}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {submissions.find(s => s.id === userSubmission.id)?.likes || 0} likes
                </span>
              </div>
            </div>

            {/* Other Submissions */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '32px' }}>
                Loading submissions...
              </div>
            ) : (
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {submissions
                  .filter(s => s.id !== userSubmission.id)
                  .map(submission => (
                    <div key={submission.id} style={{
                      background: 'var(--surface)',
                      padding: '20px',
                      borderRadius: '12px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ marginBottom: '12px' }}>
                        <Link href={`/profile/${submission.username}`} style={{ textDecoration: 'none' }}>
                          <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                            {submission.display_name || submission.username}
                          </span>
                        </Link>
                      </div>
                      <p style={{ fontSize: '16px', lineHeight: '1.4', marginBottom: '12px' }}>
                        {submission.content}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => handleLike(submission.id, submission.user_liked)}
                          style={{
                            background: submission.user_liked ? 'var(--green)' : 'var(--border)',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: 'pointer'
                          }}
                        >
                          {submission.user_liked ? '♥' : '♡'} {submission.likes}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Side Panel - Streak Info */}
      <div style={{ width: '320px' }}>
        <div style={{
          background: 'var(--surface)',
          padding: '24px',
          borderRadius: '12px'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔥 Your Streak
          </h3>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
              {userStreak?.current_streak || 0} days
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Longest: {userStreak?.longest_streak || 0} days
            </div>
          </div>

          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            {getStreakMessage()}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
              Streak ELO Breakdown
            </h4>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Day 1:</span>
                <span style={{ fontWeight: 'bold', color: 'var(--green)' }}>+1 ELO</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Days 2-6:</span>
                <span style={{ fontWeight: 'bold', color: 'var(--green)' }}>+3 ELO</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Days 7+:</span>
                <span style={{ fontWeight: 'bold', color: 'var(--green)' }}>+5 ELO</span>
              </div>
            </div>
            {userStreak && userStreak.current_streak > 0 && (
              <div style={{
                marginTop: '12px',
                padding: '8px',
                background: 'var(--background)',
                borderRadius: '6px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                Next submission: <span style={{ fontWeight: 'bold', color: 'var(--green)' }}>
                  +{getStreakELO(userStreak.current_streak + 1)} ELO
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
