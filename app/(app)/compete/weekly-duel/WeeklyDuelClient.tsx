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
}

export default function WeeklyDuelClient({
  currentDuel,
  userSubmission,
  allSubmissions,
  pastWinners,
  currentState,
  submissionDeadline,
  votingDeadline,
  currentUserId
}: WeeklyDuelClientProps) {
  const [submissionContent, setSubmissionContent] = useState('')
  const [validationError, setValidationError] = useState('')
  const [voteCooldown, setVoteCooldown] = useState(0)
  const [votedPairs, setVotedPairs] = useState(new Set<string>())
  const [currentPair, setCurrentPair] = useState<{ a: string; b: string } | null>(null)
  const [eloChange, setEloChange] = useState<number | null>(null)

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
      
      const hours = Math.floor(timeLeft / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
      
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      
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
      
      const hours = Math.floor(timeLeft / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
      
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      
      // Update countdown display
      const countdownElement = document.getElementById('voting-countdown')
      if (countdownElement) {
        countdownElement.textContent = `Voting ends in: ${timeString}`
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [votingDeadline])

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
      alert(`Please wait ${voteCooldown} seconds before voting again`)
      return
    }

    try {
      const response = await fetch('/api/weekly-duel/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`
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

  // Active state - submission form
  if (currentState === 'active' && currentDuel) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)', backgroundSize: '48px 48px', padding: '40px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: '16px', 
            padding: '32px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)', margin: '0 0 24px 0', letterSpacing: '-1px' }}>
              {currentDuel.prompt}
            </h1>
            
            <div style={{ fontSize: '16px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '16px' }}>
              {currentDuel.prompt}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div id="countdown" style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', textAlign: 'center', padding: '12px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                Loading countdown...
              </div>
            </div>

            {!userSubmission ? (
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
            ) : (
              <div style={{ textAlign: 'center', fontSize: '16px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                <div style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--green)', marginBottom: '8px' }}>
                  ✓ Submitted
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '16px' }}>
                  Your submission has been received
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Voting state
  if (currentState === 'voting' && currentDuel) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)', backgroundSize: '48px 48px', padding: '40px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: '16px', 
            padding: '32px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)', margin: '0 0 24px 0', letterSpacing: '-1px' }}>
              Vote for the best submission
            </h1>
            
            <div style={{ fontSize: '16px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '24px' }}>
              {currentDuel.prompt}
            </div>

            <div id="voting-countdown" style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', textAlign: 'center', padding: '12px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                Loading countdown...
              </div>

            {currentPair && (
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
                  <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '8px' }}>
                    {allSubmissions.find(s => s.id === currentPair.a)?.content?.substring(0, 50) || 'Idea A'}
                  </div>
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
                  <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '8px' }}>
                    {allSubmissions.find(s => s.id === currentPair.b)?.content?.substring(0, 50) || 'Idea B'}
                  </div>
                </div>
              </div>
            )}

            {voteCooldown > 0 && (
              <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginTop: '12px' }}>
                Next pair in {voteCooldown} seconds...
              </div>
            )}

            <div style={{ textAlign: 'center', fontSize: '16px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
              {votedPairs.size >= allSubmissions.length / 2 ? 
                "You've voted on all available matchups, check back for results" : 
                "Loading next matchup..."
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Results state
  if (currentState === 'results' && currentDuel && userSubmission) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)', backgroundSize: '48px 48px', padding: '40px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: '16px', 
            padding: '32px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', margin: '0 0 16px 0' }}>
              Your Results
            </h2>
            
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--green)', marginBottom: '8px' }}>
                {userSubmission.final_rank || '—'}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '8px' }}>
                {userSubmission.final_rank ? `#${userSubmission.final_rank} Place` : 'Did not place'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '16px' }}>
                {userSubmission.elo_awarded ? `+${userSubmission.elo_awarded} ELO` : 'No ELO earned'}
              </div>
            </div>
          </div>

          <div style={{ 
            background: 'var(--card)', 
            borderRadius: '16px', 
            padding: '32px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', margin: '0 0 16px 0' }}>
              Top 10 Finishers
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pastWinners.map((winner: any, index: number) => (
                <div key={winner.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '8px',
                  background: index === 0 ? 'var(--gold-tint)' : 'var(--surface)',
                  border: index === 0 ? '1px solid var(--gold)' : '1px solid var(--border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                      #{winner.rank}
                    </div>
                    <a
                      href={`/profile/${winner.username}`}
                      style={{
                        textDecoration: 'none',
                        fontSize: '16px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-display)',
                        color: 'var(--blue)',
                        letterSpacing: '-0.1px'
                      }}
                    >
                      {winner.username}
                    </a>
                    <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--green)' }}>
                      +{winner.elo_awarded} ELO
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Between rounds state
  if (currentState === 'between') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)', backgroundSize: '48px 48px', padding: '40px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: '16px', 
            padding: '32px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)', margin: '0 0 24px 0', letterSpacing: '-1px' }}>
              No Active Weekly Duel
            </h1>
            
            <div style={{ fontSize: '16px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '16px' }}>
              The next weekly duel will start soon. Check back later for the new prompt!
            </div>

            <div style={{ 
              background: 'var(--surface)', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid var(--border)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                Current submissions: {allSubmissions.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
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
