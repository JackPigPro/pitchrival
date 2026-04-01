'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface Duel {
  id: string
  prompt: string
  start_date: string
  end_date: string
  status: string
  prize_distributed: boolean
}

interface DuelSubmission {
  id: string
  user_id: string
  content: string
  vote_score: number
  vote_count: number
  final_rank: number | null
  elo_awarded: number | null
  created_at: string
  username: string
}

export default function AdminDuelManager() {
  const [prompt, setPrompt] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [duels, setDuels] = useState<Duel[]>([])
  const [selectedDuel, setSelectedDuel] = useState<Duel | null>(null)
  const [duelSubmissions, setDuelSubmissions] = useState<DuelSubmission[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [editingDuel, setEditingDuel] = useState<Duel | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const createDuel = async () => {
    if (!prompt.trim() || !startDate.trim() || !endDate.trim()) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    setSuccess('')

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch('/admin/api/create-duel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
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
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch('/admin/api/distribute-prizes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
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

  const fetchDuelDetails = async (duelId: string) => {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      // Fetch submissions with user data
      const { data: submissions, error: submissionsError } = await supabase
        .from('duel_submissions')
        .select(`
          id, user_id, content, vote_score, vote_count, final_rank, elo_awarded, created_at,
          profiles!inner(username)
        `)
        .eq('duel_id', duelId)
        .order('vote_score', { ascending: false })

      if (submissionsError) {
        console.error('Error fetching submissions:', submissionsError)
        return
      }

      // Transform to match interface
      const transformedSubmissions: DuelSubmission[] = (submissions || []).map(sub => ({
        id: sub.id,
        user_id: sub.user_id,
        content: sub.content,
        vote_score: sub.vote_score,
        vote_count: sub.vote_count,
        final_rank: sub.final_rank,
        elo_awarded: sub.elo_awarded,
        created_at: sub.created_at,
        username: (sub as any).profiles?.[0]?.username || 'Unknown'
      }))

      setDuelSubmissions(transformedSubmissions)
    } catch (error) {
      console.error('Fetch duel details error:', error)
    }
  }

  const updateDuel = async () => {
    if (!editingDuel) return

    setLoading(true)
    setSuccess('')

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch('/admin/api/update-duel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          id: editingDuel.id,
          prompt: editingDuel.prompt,
          start_date: editingDuel.start_date,
          end_date: editingDuel.end_date,
          status: editingDuel.status
        })
      })

      const result = await response.json()

      if (result.success) {
        setSuccess('Duel updated successfully!')
        setEditingDuel(null)
        fetchDuels()
      } else {
        setSuccess(result.error || 'Failed to update duel')
      }
    } catch (error) {
      setSuccess('Error updating duel')
      console.error('Update duel error:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteDuel = async (duelId: string) => {
    setLoading(true)
    setSuccess('')

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch('/admin/api/delete-duel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ duelId })
      })

      const result = await response.json()

      if (result.success) {
        setSuccess('Duel deleted successfully!')
        setShowDeleteConfirm(false)
        setSelectedDuel(null)
        fetchDuels()
      } else {
        setSuccess(result.error || 'Failed to delete duel')
      }
    } catch (error) {
      setSuccess('Error deleting duel')
      console.error('Delete duel error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDuels = async () => {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch('/admin/api/get-duels', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
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

  // Fetch duel details when duel is selected
  useEffect(() => {
    if (selectedDuel) {
      fetchDuelDetails(selectedDuel.id)
    }
  }, [selectedDuel])

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
                  <tr 
                    key={duel.id} 
                    style={{ 
                      borderBottom: '1px solid var(--border)',
                      cursor: 'pointer',
                      background: selectedDuel?.id === duel.id ? 'var(--purple-tint)' : 'transparent'
                    }}
                    onClick={() => setSelectedDuel(duel)}
                  >
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '4px' }}>
                        {duel.prompt.substring(0, 50)}{duel.prompt.length > 50 ? '...' : ''}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginTop: '8px' }}>
                        {formatDate(duel.start_date)} - {formatDate(duel.end_date)}
                      </div>
                    </td>
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '4px' }}>
                        {formatDate(duel.start_date)}
                      </div>
                    </td>
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '4px' }}>
                        {formatDate(duel.end_date)}
                      </div>
                    </td>
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        fontFamily: 'var(--font-display)', 
                        color: 'white',
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
                          onClick={(e) => {
                            e.stopPropagation()
                            distributePrizes(duel.id)
                          }}
                          disabled={loading}
                          className="btn-cta-ghost"
                          style={{ fontSize: '12px', padding: '6px 12px', marginTop: '8px' }}
                        >
                          {loading ? 'Distributing...' : 'Distribute Prizes Now'}
                        </button>
                      )}
                    </td>
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedDuel(duel)
                        }}
                        className="btn-cta-ghost"
                        style={{ fontSize: '12px', padding: '6px 12px', marginRight: '8px' }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Duel Detail View */}
      {selectedDuel && (
        <div style={{ 
          background: 'var(--card)', 
          borderRadius: '16px', 
          padding: '32px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
          marginTop: '32px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', margin: 0 }}>
              Duel Details: {selectedDuel.prompt.substring(0, 50)}{selectedDuel.prompt.length > 50 ? '...' : ''}
            </h2>
            <button
              onClick={() => setSelectedDuel(null)}
              className="btn-cta-ghost"
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              Close
            </button>
          </div>

          {editingDuel ? (
            // Edit Mode
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                  Weekly Prompt
                </label>
                <textarea
                  value={editingDuel.prompt}
                  onChange={(e) => setEditingDuel({...editingDuel, prompt: e.target.value})}
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
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                    Start Date (EST)
                  </label>
                  <input
                    type="datetime-local"
                    value={editingDuel.start_date}
                    onChange={(e) => setEditingDuel({...editingDuel, start_date: e.target.value})}
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
                    value={editingDuel.end_date}
                    onChange={(e) => setEditingDuel({...editingDuel, end_date: e.target.value})}
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

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                  Status
                </label>
                <select
                  value={editingDuel.status}
                  onChange={(e) => setEditingDuel({...editingDuel, status: e.target.value})}
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
                >
                  <option value="active">Active</option>
                  <option value="voting">Voting</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={updateDuel}
                  disabled={loading}
                  className="btn-cta-primary"
                  style={{ flex: 1 }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setEditingDuel(null)}
                  className="btn-cta-ghost"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '12px' }}>
                  Duel Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '4px' }}>Status</div>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      fontFamily: 'var(--font-display)', 
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      background: getStatusColor(selectedDuel.status),
                      display: 'inline-block'
                    }}>
                      {getStatusText(selectedDuel.status)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '4px' }}>Prizes Distributed</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                      {selectedDuel.prize_distributed ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '12px' }}>
                  Full Prompt
                </h3>
                <div style={{ 
                  padding: '16px', 
                  borderRadius: '8px', 
                  background: 'var(--surface)', 
                  border: '1px solid var(--border)',
                  fontSize: '14px',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--text)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedDuel.prompt}
                </div>
              </div>

              {/* Live Leaderboard for Voting Phase */}
              {selectedDuel.status === 'voting' && duelSubmissions.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '12px' }}>
                    Live Leaderboard
                  </h3>
                  <div style={{ background: 'var(--surface)', borderRadius: '8px', padding: '16px' }}>
                    {duelSubmissions.map((submission, index) => (
                      <div key={submission.id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: index < duelSubmissions.length - 1 ? '1px solid var(--border)' : 'none'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                            #{index + 1} {submission.username}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginTop: '4px' }}>
                            {submission.content.substring(0, 100)}{submission.content.length > 100 ? '...' : ''}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--purple)' }}>
                            {submission.vote_score}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                            {submission.vote_count} votes
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Submissions */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '12px' }}>
                  All Submissions ({duelSubmissions.length})
                </h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {duelSubmissions.map((submission) => (
                    <div key={submission.id} style={{ 
                      marginBottom: '16px', 
                      padding: '16px', 
                      borderRadius: '8px', 
                      background: 'var(--surface)', 
                      border: '1px solid var(--border)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                            {submission.username}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginTop: '4px' }}>
                            Submitted: {new Date(submission.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                            Score: {submission.vote_score}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                            {submission.vote_count} votes
                          </div>
                          {submission.final_rank && (
                            <div style={{ fontSize: '12px', color: 'var(--purple)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                              Rank: #{submission.final_rank}
                            </div>
                          )}
                          {submission.elo_awarded && (
                            <div style={{ fontSize: '12px', color: 'var(--green)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                              +{submission.elo_awarded} ELO
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        fontFamily: 'var(--font-body)', 
                        color: 'var(--text)',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.5'
                      }}>
                        {submission.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <button
                  onClick={() => setEditingDuel(selectedDuel)}
                  className="btn-cta-ghost"
                  style={{ flex: 1 }}
                >
                  Edit Duel
                </button>
                {(selectedDuel.status === 'voting' || selectedDuel.status === 'completed') && !selectedDuel.prize_distributed && (
                  <button
                    onClick={() => distributePrizes(selectedDuel.id)}
                    disabled={loading}
                    className="btn-cta-primary"
                    style={{ flex: 1 }}
                  >
                    {loading ? 'Distributing...' : 'Distribute Prizes'}
                  </button>
                )}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn-cta-danger"
                  style={{ flex: 1 }}
                >
                  Delete Duel
                </button>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'var(--card)',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '400px',
                width: '90%',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '16px' }}>
                  Delete Duel?
                </h3>
                <p style={{ fontSize: '14px', fontFamily: 'var(--font-body)', color: 'var(--text2)', marginBottom: '24px' }}>
                  This will permanently delete this duel and all associated submissions. This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => deleteDuel(selectedDuel.id)}
                    disabled={loading}
                    className="btn-cta-danger"
                    style={{ flex: 1 }}
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="btn-cta-ghost"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
