'use client'

import { useState, useEffect } from 'react'

interface WeeklyDuel {
  id: string
  prompt: string
  start_date: string
  end_date: string
  status: string
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
  rank: number
  elo_awarded: number
  user_id: string
  username: string
}

interface WeeklyDuelClientProps {
  currentDuel: WeeklyDuel | null
  userSubmission: UserSubmission | null
  allSubmissions: UserSubmission[]
  pastWinners: any[]
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
  const [submissionText, setSubmissionText] = useState('')
  const [selectedSubmissionA, setSelectedSubmissionA] = useState<string | null>(null)
  const [selectedSubmissionB, setSelectedSubmissionB] = useState<string | null>(null)
  const [voteCooldown, setVoteCooldown] = useState(0)
  const [votedPairs, setVotedPairs] = useState<Set<string>>(new Set())
  const [currentPair, setCurrentPair] = useState<{a: string, b: string} | null>(null)
  const [eloChange, setEloChange] = useState<number | null>(null)

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (currentState === 'active' && submissionDeadline) {
      const interval = setInterval(() => {
        const now = new Date()
        const deadline = new Date(submissionDeadline)
        const diff = deadline.getTime() - now.getTime()
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        } else {
          setTimeLeft('Submissions Closed')
          clearInterval(interval)
        }
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [currentState, submissionDeadline])

  // Vote cooldown timer
  useEffect(() => {
    if (voteCooldown > 0) {
      const interval = setInterval(() => {
        setVoteCooldown(prev => Math.max(0, prev - 1))
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [voteCooldown])

  const handleSubmitSubmission = async () => {
    if (!submissionText.trim()) return
    
    try {
      const response = await fetch('/api/weekly-duel/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: submissionText,
          duel_id: currentDuel?.id
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSubmissionText('')
        // Refresh user submission data
        window.location.reload()
      } else {
        console.error('Submission failed:', result.error)
      }
    } catch (error) {
      console.error('Submission error:', error)
    }
  }

  const loadNewPair = () => {
    // Get all possible pairs that user hasn't voted on
    const availableSubmissions = allSubmissions.filter((subA, indexA) => 
      !votedPairs.has(`${subA.id}-${subB.id}`) && 
      !votedPairs.has(`${subB.id}-${subA.id}`)
    )
    
    if (availableSubmissions.length < 2) {
      // Create all possible pairs
      const allPairs: string[] = []
      for (let i = 0; i < availableSubmissions.length; i++) {
        for (let j = i + 1; j < availableSubmissions.length; j++) {
          allPairs.push(`${availableSubmissions[i].id}-${availableSubmissions[j].id}`)
          allPairs.push(`${availableSubmissions[j].id}-${availableSubmissions[i].id}`)
        }
      }
      
      setVotedPairs(new Set(allPairs))
      return
    }
    
    // Select random pair from available submissions
    const randomIndex = Math.floor(Math.random() * Math.floor(availableSubmissions.length / 2))
    const selectedPair = allPairs[randomIndex]
    const [sub1, sub2] = selectedPair.split('-')
    
    if (sub1 && sub2) {
      setCurrentPair({ a: sub1, b: sub2 })
    } else {
      setCurrentPair(null)
    }
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

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg)',
      backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
      padding: '40px 24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* No active duel state */}
        {currentState === 'between' && (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 40px',
            background: 'var(--card)',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ marginBottom: '10px', fontSize: '13px', letterSpacing: '2.4px', textTransform: 'uppercase', color: 'var(--text3)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              ⚔️ COMPETE
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-.8px', color: 'var(--text)', fontFamily: 'var(--font-display)', margin: '0 0 20px 0' }}>
              Next duel coming soon
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--text2)', fontFamily: 'var(--font-body)', margin: 0 }}>
              Check back soon for the next weekly challenge!
            </p>
          </div>
        )}

        {/* Active state */}
        {currentState === 'active' && currentDuel && (
          <div style={{ marginBottom: '32px' }}>
            {/* Prompt */}
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              marginBottom: '24px'
            }}>
              <div style={{ marginBottom: '10px', fontSize: '13px', letterSpacing: '2.4px', textTransform: 'uppercase', color: 'var(--text3)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                ⚔️ COMPETE
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-2px', fontFamily: 'var(--font-display)', color: 'var(--text)', margin: '0 0 16px 0' }}>
                {currentDuel.prompt}
              </h1>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '8px' }}>
                    <strong>Start:</strong> {formatDate(currentDuel.start_date)} (EST)
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '8px' }}>
                    <strong>End:</strong> {formatDate(currentDuel.end_date)} (EST)
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--green)', marginBottom: '8px' }}>
                    {allSubmissions.length} submissions
                  </div>
                  {timeLeft && (
                    <div style={{ fontSize: '16px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                      <strong>Closes in:</strong> {timeLeft}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submission area */}
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', margin: '0 0 20px 0' }}>
                Your Submission
              </h2>
              
              {!userSubmission ? (
                <div>
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Share your idea, strategy, or solution..."
                    style={{
                      width: '100%',
                      height: '120px',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      fontSize: '16px',
                      fontFamily: 'var(--font-body)',
                      color: 'var(--text)',
                      resize: 'vertical',
                      marginBottom: '16px'
                    }}
                  />
                  <button
                    onClick={handleSubmitSubmission}
                    className="btn-cta-primary"
                    style={{ width: '100%' }}
                    disabled={!submissionText.trim()}
                  >
                    Submit Your Idea
                  </button>
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px',
                  background: 'var(--green-tint)',
                  borderRadius: '8px',
                  border: '1px solid var(--green)',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--green)', marginBottom: '8px' }}>
                    ✓ Submission Received
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                    Your idea is locked in and ready for voting!
                  </div>
                  <button className="btn-cta-ghost" style={{ marginTop: '16px' }}>
                    Open in Vault →
                  </button>
                </div>
              )}

              {/* Prize breakdown */}
              <div style={{ 
                marginTop: '24px', 
                paddingTop: '24px',
                borderTop: '1px solid var(--border)'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--text)', margin: '0 0 16px 0' }}>
                  Prize Breakdown
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ fontSize: '14px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                    <strong>1st</strong> +100 ELO
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                    <strong>2nd</strong> +90 ELO
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                    <strong>3rd</strong> +80 ELO
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '12px' }}>
                  <div style={{ fontSize: '14px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                    <strong>4th-5th</strong> +60 ELO
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                    <strong>6th-10th</strong> +40 ELO
                  </div>
                </div>
                <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                  <strong>Everyone who submits</strong> +10 ELO
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Voting state */}
        {currentState === 'voting' && currentDuel && (
          <div style={{ marginBottom: '32px' }}>
            {/* Prompt */}
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              marginBottom: '24px'
            }}>
              <div style={{ marginBottom: '10px', fontSize: '13px', letterSpacing: '2.4px', textTransform: 'uppercase', color: 'var(--text3)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                ⚔️ COMPETE
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-2px', fontFamily: 'var(--font-display)', color: 'var(--text)', margin: '0 0 16px 0' }}>
                {currentDuel.prompt}
              </h1>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '8px' }}>
                    <strong>Voting Period:</strong> {formatDate(currentDuel.start_date)} - {formatDate(currentDuel.end_date)} (EST)
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--green)', marginBottom: '8px' }}>
                    {allSubmissions.length} submissions
                  </div>
                  {votingDeadline && (
                    <div style={{ fontSize: '16px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                      <strong>Voting Ends:</strong> {formatDate(votingDeadline.toISOString())}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Voting interface */}
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', margin: '0 0 20px 0' }}>
                Vote for the Best Idea
              </h2>
              
              {currentPair ? (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '20px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        padding: '20px', 
                        borderRadius: '12px',
                        border: '2px solid var(--blue)',
                        background: 'var(--blue-tint)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => handleVote(currentPair.a, currentPair.b)}
                    >
                        <div style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '8px' }}>
                          {allSubmissions.find(s => s.id === currentPair.a)?.content?.substring(0, 50) || 'Idea A'}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        padding: '20px', 
                        borderRadius: '12px',
                        border: '2px solid var(--purple)',
                        background: 'var(--purple-tint)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => handleVote(currentPair.b, currentPair.a)}
                      >
                        <div style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '8px' }}>
                          {allSubmissions.find(s => s.id === currentPair.b)?.content?.substring(0, 50) || 'Idea B'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {voteCooldown > 0 && (
                    <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginTop: '12px' }}>
                      Next pair in {voteCooldown} seconds...
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', fontSize: '16px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                  {votedPairs.size >= allSubmissions.length / 2 ? 
                    "You've voted on all available matchups, check back for results" : 
                    "Loading next matchup..."
                  }
                </div>
              )}

              {/* Vote counter */}
              <div style={{ 
                marginTop: '20px', 
                paddingTop: '20px',
                borderTop: '1px solid var(--border)',
                fontSize: '14px', 
                color: 'var(--text2)', 
                fontFamily: 'var(--font-body)' 
              }}>
                Pairs voted on: {votedPairs.size} / {Math.floor(allSubmissions.length / 2)}
              </div>
            </div>
          </div>
        )}

        {/* Results state */}
        {currentState === 'results' && currentDuel && (
          <div style={{ marginBottom: '32px' }}>
            {/* User's result */}
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
                <div style={{ fontSize: '48px', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--green)', marginBottom: '8px' }}>
                  {userSubmission?.final_rank || '—'}
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '8px' }}>
                  {userSubmission?.final_rank ? `#${userSubmission.final_rank} Place` : 'Did not place'}
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '16px' }}>
                  {userSubmission?.elo_awarded ? `+${userSubmission.elo_awarded} ELO` : 'No ELO earned'}
                </div>
              </div>
            </div>

            {/* Top 10 finishers */}
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
                        href={`/profile/${winner.user_id.username}`}
                        style={{
                          textDecoration: 'none',
                          fontSize: '16px',
                          fontWeight: 700,
                          fontFamily: 'var(--font-display)',
                          color: 'var(--blue)',
                          letterSpacing: '-0.1px'
                        }}
                      >
                        {winner.user_id.username}
                      </a>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--green)' }}>
                      +{winner.elo_awarded} ELO
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Past Winners */}
        <div style={{ 
          background: 'var(--card)', 
          borderRadius: '16px', 
          padding: '32px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700', fontFamily: 'var(--font-display)', color: 'var(--text)', margin: '0 0 16px 0' }}>
            Past Winners
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pastWinners.map((winner: any) => (
              <div key={winner.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: '8px',
                background: 'var(--surface)',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '4px' }}>
                      {formatDate(winner.created_at)}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                      {winner.prompt}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <a
                      href={`/profile/${winner.user_id.username}`}
                      style={{
                        textDecoration: 'none',
                        fontSize: '16px',
                        fontWeight: '700',
                        fontFamily: 'var(--font-display)',
                        color: 'var(--blue)',
                        letterSpacing: '-0.1px'
                      }}
                    >
                      {winner.user_id.username}
                    </a>
                    <div style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--green)' }}>
                      +{winner.elo_awarded} ELO
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
