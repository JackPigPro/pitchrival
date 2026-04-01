'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface WeeklyDuel {
  id: string
  prompt: string
  start_date: string
  end_date: string
  status: 'active' | 'voting' | 'completed' | 'between'
  prize_distributed: boolean
}

interface UserSubmission {
  id: string
  content: string
  vote_score: number
  vote_count: number
  created_at: string
  final_rank?: number
  elo_awarded?: number
}

interface Winner {
  id: string
  rank: number
  elo_awarded: number
  user_id: {
    username: string
  }
  created_at: string
}

interface WeeklyDuelClientProps {
  currentDuel: WeeklyDuel | null
  userSubmission: UserSubmission | null
  allSubmissions: UserSubmission[]
  pastWinners: Winner[]
  currentState: 'active' | 'voting' | 'results' | 'between'
  submissionDeadline: Date | null
  votingDeadline: Date | null
  currentUserId: string
  onRefresh?: () => void
}

export default function WeeklyDuelClient({
  currentDuel,
  userSubmission,
  allSubmissions,
  pastWinners,
  currentState,
  submissionDeadline,
  votingDeadline,
  currentUserId,
  onRefresh
}: WeeklyDuelClientProps) {
  const [submissionContent, setSubmissionContent] = useState('')
  const [validationError, setValidationError] = useState('')
  const [voteCooldown, setVoteCooldown] = useState(0)
  const [votedPairs, setVotedPairs] = useState(new Set<string>())
  const [currentPair, setCurrentPair] = useState<{ a: string; b: string } | null>(null)
  const [eloChange, setEloChange] = useState<number | null>(null)
  const [adminPreviewState, setAdminPreviewState] = useState<'active' | 'voting' | 'results'>('active')
  const [hasSubmittedPreview, setHasSubmittedPreview] = useState(false)

  // Check if user is admin
  const ADMIN_USER_ID = '9caa7790-28ca-4b10-92fb-960cf95fd4fe'
  const isAdmin = currentUserId === ADMIN_USER_ID

  // Get current state (admin override or real state)
  const displayState = isAdmin ? adminPreviewState : currentState
  const displayUserSubmission = isAdmin && hasSubmittedPreview ? { id: 'preview', content: 'Preview submission', vote_score: 0, vote_count: 0, created_at: new Date().toISOString() } as UserSubmission : userSubmission

  // Countdown timers
  useEffect(() => {
    if (!submissionDeadline) return

    const timer = setInterval(() => {
      const now = new Date()
      const timeLeft = submissionDeadline.getTime() - now.getTime()
      
      if (timeLeft <= 0) {
        clearInterval(timer)
        return
      }
      
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
      
      let timeString = ''
      if (days > 0) {
        timeString += `${days} day${days === 1 ? '' : 's'} `
      }
      if (days > 0 || hours > 0) {
        timeString += `${hours} hour${hours === 1 ? '' : 's'} `
      }
      if (days > 0 || hours > 0 || minutes > 0) {
        timeString += `${minutes} minute${minutes === 1 ? '' : 's'} `
      }
      timeString += `${seconds} second${seconds === 1 ? '' : 's'}`
      
      // Update countdown display
      const countdownElement = document.getElementById('countdown')
      if (countdownElement) {
        countdownElement.textContent = `Time remaining: ${timeString}`
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [submissionDeadline])

  useEffect(() => {
    if (!votingDeadline) return

    const timer = setInterval(() => {
      const now = new Date()
      const timeLeft = votingDeadline.getTime() - now.getTime()
      
      if (timeLeft <= 0) {
        clearInterval(timer)
        return
      }
      
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
      
      let timeString = ''
      if (days > 0) {
        timeString += `${days} day${days === 1 ? '' : 's'} `
      }
      if (days > 0 || hours > 0) {
        timeString += `${hours} hour${hours === 1 ? '' : 's'} `
      }
      if (days > 0 || hours > 0 || minutes > 0) {
        timeString += `${minutes} minute${minutes === 1 ? '' : 's'} `
      }
      timeString += `${seconds} second${seconds === 1 ? '' : 's'}`
      
      // Update countdown display
      const countdownElement = document.getElementById('voting-countdown')
      if (countdownElement) {
        countdownElement.textContent = `Voting ends in: ${timeString}`
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [votingDeadline])

  // Vote cooldown timer
  useEffect(() => {
    if (voteCooldown <= 0) return

    const timer = setTimeout(() => {
      setVoteCooldown(voteCooldown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [voteCooldown])

  const handleSubmitSubmission = async () => {
    if (!submissionContent.trim()) {
      setValidationError('Please write something before submitting.')
      return
    }

    try {
      // Get session token properly
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.access_token) {
        setValidationError('Authentication required. Please log in.')
        return
      }

      console.log('Submitting with token:', session.access_token?.substring(0, 10) + '...')
      console.log('Duel ID:', currentDuel?.id)

      const response = await fetch('/compete/weekly-duel/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          content: submissionContent,
          duel_id: currentDuel?.id
        })
      })

      console.log('Response status:', response.status)
      const result = await response.json()
      console.log('Response data:', result)
      
      if (result.success) {
        setSubmissionContent('')
        setValidationError('')
        // Refresh page to show submission
        window.location.reload()
      } else {
        console.error('Submit failed:', result.error)
        setValidationError(result.error || 'Failed to submit. Please try again.')
      }
    } catch (error) {
      console.error('Submit error:', error)
      setValidationError('Network error. Please try again.')
    }
  }

  const handleVote = async (winnerId: string, loserId: string) => {
    if (voteCooldown > 0) {
      return
    }

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.access_token) {
        return
      }

      const response = await fetch('/compete/weekly-duel/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          winner_submission_id: winnerId,
          loser_submission_id: loserId
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setEloChange(result.elo_change || 1)
        setVoteCooldown(30)
        
        // Mark this pair as voted
        const newVotedPairs = new Set(votedPairs)
        newVotedPairs.add(`${winnerId}-${loserId}`)
        newVotedPairs.add(`${loserId}-${winnerId}`)
        setVotedPairs(newVotedPairs)
        
        // Load new pair after successful vote
        setTimeout(() => {
          loadNewPair()
        }, 1000)
      } else {
        console.error('Vote failed:', result.error)
      }
    } catch (error) {
      console.error('Vote error:', error)
    }
  }

  const loadNewPair = () => {
    // Get all possible pairs that user hasn't voted on
    const availablePairs: string[] = []
    
    for (let i = 0; i < allSubmissions.length; i++) {
      for (let j = i + 1; j < allSubmissions.length; j++) {
        const pair1 = `${allSubmissions[i].id}-${allSubmissions[j].id}`
        const pair2 = `${allSubmissions[j].id}-${allSubmissions[i].id}`
        
        if (!votedPairs.has(pair1) && !votedPairs.has(pair2)) {
          availablePairs.push(pair1)
        }
      }
    }
    
    if (availablePairs.length === 0) {
      setCurrentPair(null)
      return
    }
    
    // Select random pair
    const randomIndex = Math.floor(Math.random() * availablePairs.length)
    const selectedPair = availablePairs[randomIndex]
    const [sub1, sub2] = selectedPair.split('-')
    
    setCurrentPair({ a: sub1, b: sub2 })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      timeZone: 'America/New_York' 
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      timeZone: 'America/New_York' 
    })
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'var(--gold)'
    if (rank === 2) return 'var(--silver)'
    if (rank === 3) return 'var(--bronze)'
    if (rank <= 5) return 'var(--purple)'
    if (rank <= 10) return 'var(--green)'
    return 'var(--grey)'
  }

  const getPodiumPosition = (rank: number) => {
    if (rank === 1) return 'center'
    if (rank === 2) return 'left'
    if (rank === 3) return 'right'
    return 'none'
  }

  const getPodiumSize = (rank: number) => {
    if (rank === 1) return '120px'
    if (rank === 2) return '100px'
    if (rank === 3) return '80px'
    return '0'
  }

  // Get top 3 past winners
  const top3Winners = pastWinners.slice(0, 3)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)', backgroundSize: '48px 48px' }}>
      {/* Admin Preview Bar */}
      {isAdmin && (
        <div style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '14px',
          fontFamily: 'var(--font-body)'
        }}>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>Admin Preview</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setAdminPreviewState('active')}
              style={{
                padding: '4px 12px',
                borderRadius: '4px',
                border: adminPreviewState === 'active' ? '1px solid var(--purple)' : '1px solid var(--border)',
                background: adminPreviewState === 'active' ? 'var(--purple-tint)' : 'var(--surface)',
                color: 'var(--text)',
                fontSize: '12px',
                fontFamily: 'var(--font-display)',
                cursor: 'pointer'
              }}
            >
              Active
            </button>
            <button
              onClick={() => setAdminPreviewState('voting')}
              style={{
                padding: '4px 12px',
                borderRadius: '4px',
                border: adminPreviewState === 'voting' ? '1px solid var(--purple)' : '1px solid var(--border)',
                background: adminPreviewState === 'voting' ? 'var(--purple-tint)' : 'var(--surface)',
                color: 'var(--text)',
                fontSize: '12px',
                fontFamily: 'var(--font-display)',
                cursor: 'pointer'
              }}
            >
              Voting
            </button>
            <button
              onClick={() => setAdminPreviewState('results')}
              style={{
                padding: '4px 12px',
                borderRadius: '4px',
                border: adminPreviewState === 'results' ? '1px solid var(--purple)' : '1px solid var(--border)',
                background: adminPreviewState === 'results' ? 'var(--purple-tint)' : 'var(--surface)',
                color: 'var(--text)',
                fontSize: '12px',
                fontFamily: 'var(--font-display)',
                cursor: 'pointer'
              }}
            >
              Results
            </button>
          </div>
          {adminPreviewState === 'active' && (
            <button
              onClick={() => setHasSubmittedPreview(!hasSubmittedPreview)}
              style={{
                padding: '4px 12px',
                borderRadius: '4px',
                border: '1px solid var(--border)',
                background: hasSubmittedPreview ? 'var(--green-tint)' : 'var(--surface)',
                color: 'var(--text)',
                fontSize: '12px',
                fontFamily: 'var(--font-display)',
                cursor: 'pointer'
              }}
            >
              {hasSubmittedPreview ? 'Submitted' : 'Not Submitted'}
            </button>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px', maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        
        {/* Left Side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Current Prompt */}
          {currentDuel && (
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)'
            }}>
              <h1 style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)', margin: '0 0 16px 0', letterSpacing: '-1px' }}>
                {currentDuel.prompt}
              </h1>
              
              {/* Countdown Timer */}
              {displayState === 'active' && submissionDeadline && (
                <div style={{ marginBottom: '24px' }}>
                  <div id="countdown" style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--purple)', textAlign: 'center', padding: '16px', borderRadius: '8px', background: 'var(--purple-tint)', border: '1px solid var(--purple)' }}>
                    Loading countdown...
                  </div>
                </div>
              )}

              {/* Voting Countdown */}
              {displayState === 'voting' && votingDeadline && (
                <div style={{ marginBottom: '24px' }}>
                  <div id="voting-countdown" style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--purple)', textAlign: 'center', padding: '16px', borderRadius: '8px', background: 'var(--purple-tint)', border: '1px solid var(--purple)' }}>
                    Loading countdown...
                  </div>
                </div>
              )}

              {/* Active State - Submission Form */}
              {displayState === 'active' && !displayUserSubmission && (
                <div>
                  <textarea
                    value={submissionContent}
                    onChange={(e) => {
                      setSubmissionContent(e.target.value)
                      if (validationError) setValidationError('')
                    }}
                    placeholder="Enter your weekly submission..."
                    style={{
                      width: '100%',
                      height: '120px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      fontSize: '16px',
                      fontFamily: 'var(--font-body)',
                      color: 'var(--text)',
                      resize: 'vertical',
                      marginBottom: validationError ? '8px' : '16px'
                    }}
                  />
                  
                  {validationError && (
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--red)',
                      fontFamily: 'var(--font-body)',
                      marginBottom: '16px'
                    }}>
                      {validationError}
                    </div>
                  )}
                  
                  <button
                    onClick={handleSubmitSubmission}
                    className="btn-cta-primary"
                    style={{ width: '100%' }}
                  >
                    Submit Entry
                  </button>
                </div>
              )}

              {/* Active State - Already Submitted */}
              {displayState === 'active' && displayUserSubmission && (
                <div style={{ textAlign: 'center', fontSize: '18px', color: 'var(--text2)', fontFamily: 'var(--font-body)', padding: '32px' }}>
                  <div style={{ fontSize: '64px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--green)', marginBottom: '16px' }}>
                    ✓ Submitted
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                    Your submission has been received
                  </div>
                </div>
              )}

              {/* Voting State */}
              {displayState === 'voting' && (
                <div>
                  {allSubmissions.length < 2 ? (
                    <div style={{ textAlign: 'center', fontSize: '18px', color: 'var(--text2)', fontFamily: 'var(--font-body)', padding: '32px' }}>
                      <div style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '16px' }}>
                        🗳
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                        Voting requires at least 2 submissions to generate matchups.
                      </div>
                    </div>
                  ) : currentPair ? (
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '24px', textAlign: 'center' }}>
                        Vote for better submission
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                        <div style={{ 
                          textAlign: 'center', 
                          padding: '32px', 
                          borderRadius: '12px',
                          border: '2px solid var(--purple)',
                          background: 'var(--purple-tint)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                          onClick={() => handleVote(currentPair.a, currentPair.b)}
                        >
                          <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '16px' }}>
                            {allSubmissions.find(s => s.id === currentPair.a)?.content?.substring(0, 100) || 'Submission A'}
                          </div>
                          <button
                            style={{
                              padding: '8px 24px',
                              borderRadius: '6px',
                              border: 'none',
                              background: 'var(--purple)',
                              color: 'white',
                              fontSize: '14px',
                              fontWeight: 600,
                              fontFamily: 'var(--font-display)',
                              cursor: 'pointer'
                            }}
                          >
                            Vote
                          </button>
                        </div>
                        
                        <div style={{ 
                          textAlign: 'center', 
                          padding: '32px', 
                          borderRadius: '12px',
                          border: '2px solid var(--purple)',
                          background: 'var(--purple-tint)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                          onClick={() => handleVote(currentPair.b, currentPair.a)}
                        >
                          <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '16px' }}>
                            {allSubmissions.find(s => s.id === currentPair.b)?.content?.substring(0, 100) || 'Submission B'}
                          </div>
                          <button
                            style={{
                              padding: '8px 24px',
                              borderRadius: '6px',
                              border: 'none',
                              background: 'var(--purple)',
                              color: 'white',
                              fontSize: '14px',
                              fontWeight: 600,
                              fontFamily: 'var(--font-display)',
                              cursor: 'pointer'
                            }}
                          >
                            Vote
                          </button>
                        </div>
                      </div>

                      {voteCooldown > 0 && (
                        <div style={{ textAlign: 'center', fontSize: '16px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginTop: '12px' }}>
                          Next pair in {voteCooldown} seconds...
                        </div>
                      )}

                      <div style={{ textAlign: 'center', fontSize: '16px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                        You've voted on {votedPairs.size} pairs
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', fontSize: '18px', color: 'var(--text2)', fontFamily: 'var(--font-body)', padding: '32px' }}>
                      <div style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--green)', marginBottom: '16px' }}>
                        ✓ Complete
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                        You've voted on all available matchups
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Results State */}
              {displayState === 'results' && (
                <div style={{ textAlign: 'center', padding: '32px' }}>
                  {displayUserSubmission ? (
                    <>
                      <div style={{ fontSize: '64px', fontWeight: 800, fontFamily: 'var(--font-display)', color: getRankColor(displayUserSubmission.final_rank || 0), marginBottom: '16px' }}>
                        #{displayUserSubmission.final_rank || '—'}
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '16px' }}>
                        {displayUserSubmission.final_rank ? `Place #${displayUserSubmission.final_rank}` : 'Did not place'}
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--green)', marginBottom: '16px' }}>
                        {displayUserSubmission.elo_awarded ? `+${displayUserSubmission.elo_awarded} ELO` : 'No ELO earned'}
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '16px' }}>
                        🏆
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                        Results will appear here after prizes are distributed.
                      </div>
                    </>
                  )}
                </div>
              )}

                          </div>
          )}

          {/* No Active Duel */}
          {!currentDuel && (
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '16px' }}>
                🔄
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                Next duel coming soon
              </div>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Dates and Submission Counter */}
          {currentDuel && (
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '24px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', margin: '0 0 16px 0' }}>
                Duel Details
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '4px' }}>Starts</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                    {formatDate(currentDuel.start_date)} at {formatTime(currentDuel.start_date)} EST
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '4px' }}>Ends</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                    {formatDate(currentDuel.end_date)} at {formatTime(currentDuel.end_date)} EST
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '4px' }}>Voting Period</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                    {formatDate(currentDuel.end_date)} at {formatTime(currentDuel.end_date)} EST - 
                    {formatDate(new Date(new Date(currentDuel.end_date).getTime() + 24 * 60 * 60 * 1000).toISOString())} at {formatTime(new Date(new Date(currentDuel.end_date).getTime() + 24 * 60 * 60 * 1000).toISOString())} EST
                  </div>
                </div>
              </div>

              <div style={{ 
                marginTop: '20px', 
                padding: '16px', 
                borderRadius: '8px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                  {allSubmissions.length === 1 ? '1 entrepreneur has entered' : `${allSubmissions.length} entrepreneurs have entered`}
                </div>
              </div>
            </div>
          )}

          {/* Prize Breakdown */}
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: '16px', 
            padding: '24px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', margin: '0 0 16px 0' }}>
              Prize Breakdown
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🥇</span>
                <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--gold)' }}>1st place +100 ELO</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🥈</span>
                <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--silver)' }}>2nd place +90 ELO</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🥉</span>
                <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--bronze)' }}>3rd place +80 ELO</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--purple)' }}>4th-5th place +60 ELO</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--green)' }}>6th-10th place +40 ELO</span>
              </div>
              <div style={{ 
                marginTop: '8px',
                padding: '8px 12px',
                borderRadius: '6px',
                background: 'var(--surface)',
                border: '1px solid var(--border)'
              }}>
                <span style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                  Everyone who submits +10 ELO
                </span>
              </div>
              <div style={{ 
                marginTop: '12px',
                fontSize: '12px',
                color: 'var(--text2)',
                fontFamily: 'var(--font-body)',
                fontStyle: 'italic'
              }}>
                Prizes are distributed after the voting period ends.
              </div>
            </div>
          </div>

          {/* Past Winners Podium */}
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: '16px', 
            padding: '24px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', margin: '0 0 16px 0' }}>
              Recent Winners
            </h3>
            
            {top3Winners.length > 0 ? (
              <div>
                {/* Podium */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '16px', marginBottom: '20px', height: '140px' }}>
                  {/* 2nd Place */}
                  {top3Winners.find(w => w.rank === 2) && (
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      order: 2
                    }}>
                      <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '8px',
                        background: 'var(--silver)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px',
                        border: '2px solid var(--silver)'
                      }}>
                        <span style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'white' }}>2</span>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', textAlign: 'center' }}>
                        <a
                          href={`/profile/${top3Winners.find(w => w.rank === 2)?.user_id.username}`}
                          style={{
                            textDecoration: 'none',
                            color: 'var(--blue)',
                            fontSize: '12px'
                          }}
                        >
                          {top3Winners.find(w => w.rank === 2)?.user_id.username}
                        </a>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--silver)', fontWeight: 600 }}>
                        +{top3Winners.find(w => w.rank === 2)?.elo_awarded} ELO
                      </div>
                    </div>
                  )}
                  
                  {/* 1st Place */}
                  {top3Winners.find(w => w.rank === 1) && (
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      order: 1
                    }}>
                      <div style={{ 
                        width: '100px', 
                        height: '100px', 
                        borderRadius: '8px',
                        background: 'var(--gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px',
                        border: '2px solid var(--gold)'
                      }}>
                        <span style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'white' }}>1</span>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', textAlign: 'center' }}>
                        <a
                          href={`/profile/${top3Winners.find(w => w.rank === 1)?.user_id.username}`}
                          style={{
                            textDecoration: 'none',
                            color: 'var(--blue)',
                            fontSize: '14px'
                          }}
                        >
                          {top3Winners.find(w => w.rank === 1)?.user_id.username}
                        </a>
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--gold)', fontWeight: 700 }}>
                        +{top3Winners.find(w => w.rank === 1)?.elo_awarded} ELO
                      </div>
                    </div>
                  )}
                  
                  {/* 3rd Place */}
                  {top3Winners.find(w => w.rank === 3) && (
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      order: 3
                    }}>
                      <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '8px',
                        background: 'var(--bronze)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px',
                        border: '2px solid var(--bronze)'
                      }}>
                        <span style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'white' }}>3</span>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', textAlign: 'center' }}>
                        <a
                          href={`/profile/${top3Winners.find(w => w.rank === 3)?.user_id.username}`}
                          style={{
                            textDecoration: 'none',
                            color: 'var(--blue)',
                            fontSize: '12px'
                          }}
                        >
                          {top3Winners.find(w => w.rank === 3)?.user_id.username}
                        </a>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--bronze)', fontWeight: 600 }}>
                        +{top3Winners.find(w => w.rank === 3)?.elo_awarded} ELO
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Prompt */}
                <div style={{ 
                  padding: '12px', 
                  borderRadius: '8px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '4px' }}>
                    Last week's prompt
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                    {pastWinners[0]?.id ? 'Previous duel prompt' : 'No past duels yet'}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ 
                padding: '32px', 
                borderRadius: '8px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '16px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                  No past duels yet
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ELO Change Toast */}
      {eloChange !== null && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'var(--green)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          fontFamily: 'var(--font-display)',
          boxShadow: 'var(--shadow)',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}>
          {eloChange > 0 ? '+' : ''}{eloChange} ELO
        </div>
      )}
    </div>
  )
}
