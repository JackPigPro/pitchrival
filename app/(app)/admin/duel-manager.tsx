'use client'

import { useState, useEffect } from 'react'

interface Duel {
  id: string
  prompt: string
  start_date: string
  end_date: string
  status: string
  prize_distributed: boolean
}

export default function AdminDuelManager() {
  const [prompt, setPrompt] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [duels, setDuels] = useState<Duel[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const createDuel = async () => {
    if (!prompt.trim() || !startDate.trim() || !endDate.trim()) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    setSuccess('')

    try {
      const response = await fetch('/api/admin/create-duel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          start_date: startDate,
          end_date: endDate
        })
      })

      const result = await response.json()

      if (result.success) {
        setPrompt('')
        setStartDate('')
        setEndDate('')
        setSuccess('Weekly duel created successfully!')
        // Refresh duels list
        fetchDuels()
      } else {
        setSuccess(result.error || 'Failed to create duel')
      }
    } catch (error) {
      setSuccess('Error creating duel')
      console.error('Create duel error:', error)
    } finally {
      setLoading(false)
    }
  }

  const distributePrizes = async (duelId: string) => {
    setLoading(true)
    setSuccess('')

    try {
      const response = await fetch('/api/admin/distribute-prizes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ duelId })
      })

      const result = await response.json()

      if (result.success) {
        setSuccess('Prizes distributed successfully!')
        // Refresh duels list
        fetchDuels()
      } else {
        setSuccess(result.error || 'Failed to distribute prizes')
      }
    } catch (error) {
      setSuccess('Error distributing prizes')
      console.error('Distribute prizes error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDuels = async () => {
    try {
      const response = await fetch('/api/admin/get-duels')
      const result = await response.json()
      
      if (result.success) {
        setDuels(result.duels || [])
      } else {
        console.error('Failed to fetch duels:', result.error)
      }
    } catch (error) {
      console.error('Fetch duels error:', error)
    }
  }

  // Fetch duels on component mount
  useEffect(() => {
    fetchDuels()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      timeZone: 'America/New_York' 
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'var(--green)'
      case 'voting': return 'var(--blue)'
      case 'completed': return 'var(--gold)'
      default: return 'var(--text2)'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'voting': return 'Voting'
      case 'completed': return 'Completed'
      default: return status
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
      
      {/* Create New Duel */}
      <div style={{ 
        background: 'var(--card)', 
        borderRadius: '16px', 
        padding: '32px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', margin: '0 0 20px 0' }}>
          Create New Weekly Duel
        </h2>
        
        <div style={{ marginBottom: '16px' }}>
          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
              Weekly Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter the weekly prompt..."
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
                marginBottom: '16px'
              }}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                Start Date (EST)
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: '16px',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--text)'
                }}
              />
            </div>
            
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                End Date (EST)
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: '16px',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--text)'
                }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={createDuel}
          disabled={loading}
          className="btn-cta-primary"
          style={{ width: '100%' }}
        >
          {loading ? 'Creating...' : 'Create Duel'}
        </button>

        {success && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '8px',
            background: success.includes('successfully') ? 'var(--green-tint)' : 'var(--red-tint)',
            border: success.includes('successfully') ? '1px solid var(--green)' : '1px solid var(--red)',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: 'var(--font-display)',
            color: success.includes('successfully') ? 'var(--green)' : 'var(--red)'
          }}>
            {success}
          </div>
        )}
      </div>

      {/* Manage Existing Duels */}
      <div style={{ 
        background: 'var(--card)', 
        borderRadius: '16px', 
        padding: '32px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', margin: '0 0 20px 0' }}>
          Manage Existing Duels
        </h2>
        
        {duels.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
            No duels found. Create your first weekly duel above.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px',
              fontFamily: 'var(--font-body)'
            }}>
              <thead>
                <tr style={{ background: 'var(--surface)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--border)', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                    Prompt
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--border)', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                    Start Date
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--border)', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                    End Date
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--border)', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--border)', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {duels.map((duel) => (
                  <tr key={duel.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '4px' }}>
                        {duel.prompt}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginTop: '8px' }}>
                        {formatDate(duel.start_date)} - {formatDate(duel.end_date)}
                      </div>
                    </td>
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        fontFamily: 'var(--font-display)', 
                        color: getStatusColor(duel.status),
                        marginBottom: '4px',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        background: getStatusColor(duel.status),
                        display: 'inline-block'
                      }}>
                        {getStatusText(duel.status)}
                      </div>
                      {duel.status === 'voting' && !duel.prize_distributed && (
                        <button
                          onClick={() => distributePrizes(duel.id)}
                          disabled={loading}
                          className="btn-cta-ghost"
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          {loading ? 'Distributing...' : 'Distribute Prizes Now'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
