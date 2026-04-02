'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'

interface Duel {
  id: string
  prompt: string
  start_date: string
  end_date: string
  voting_start?: string
  voting_end?: string
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
  const realtimeSubscription = useRef<any>(null)

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

  const fetchDuelDetails = async (duelId: string) => {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      // First fetch submissions from duel_submissions
      const { data: submissions, error: submissionsError } = await supabase
        .from('duel_submissions')
        .select('id, user_id, content, vote_score, vote_count, final_rank, elo_awarded, created_at')
        .eq('duel_id', duelId)
        .order('vote_score', { ascending: false })

      if (submissionsError) {
        console.error('Error fetching submissions:', submissionsError)
        return
      }

      // Then fetch usernames from profiles for all user_ids
      const userIds = (submissions || []).map(sub => sub.user_id)
      let profilesMap: { [key: string]: string } = {}
      
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds)
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError)
        } else {
          // Create a map of user_id to username
          profilesMap = (profiles || []).reduce((acc, profile) => {
            acc[profile.id] = profile.username || 'Unknown'
            return acc
          }, {} as { [key: string]: string })
        }
      }

      // Merge submissions with usernames
      const transformedSubmissions: DuelSubmission[] = (submissions || []).map(sub => ({
        id: sub.id,
        user_id: sub.user_id,
        content: sub.content,
        vote_score: sub.vote_score,
        vote_count: sub.vote_count,
        final_rank: sub.final_rank,
        elo_awarded: sub.elo_awarded,
        created_at: sub.created_at,
        username: profilesMap[sub.user_id] || 'Unknown'
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
      
      // Set up real-time subscription for voting phase
      if (selectedDuel.status === 'voting') {
        const supabase = createClient()
        
        // Clean up existing subscription
        if (realtimeSubscription.current) {
          realtimeSubscription.current.unsubscribe()
        }
        
        // Subscribe to duel_submissions changes for this duel
        realtimeSubscription.current = supabase
          .channel(`duel-submissions-${selectedDuel.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'duel_submissions',
              filter: `duel_id=eq.${selectedDuel.id}`
            },
            (payload: any) => {
              // Refresh submissions when vote_score or vote_count changes
              if (payload.new.vote_score !== payload.old.vote_score || 
                  payload.new.vote_count !== payload.old.vote_count) {
                fetchDuelDetails(selectedDuel.id)
              }
            }
          )
          .subscribe()
      }
    }
    
    // Cleanup subscription when duel changes or component unmounts
    return () => {
      if (realtimeSubscription.current) {
        realtimeSubscription.current.unsubscribe()
        realtimeSubscription.current = null
      }
    }
  }, [selectedDuel])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
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
                <tr>
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
          borderRadius: '0', 
          padding: '40px 24px',
          border: 'none',
          boxShadow: 'none',
          marginTop: '32px',
          width: 'calc(100% + 48px)',
          marginLeft: '-24px',
          marginRight: '-24px',
          position: 'relative',
          left: '-24px',
          right: '-24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', margin: 0 }}>
              Duel Details: {selectedDuel.prompt.substring(0, 100)}{selectedDuel.prompt.length > 100 ? '...' : ''}
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
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)', display: 'block', marginBottom: '8px' }}>
                  Weekly Prompt
                </label>
                <textarea
                  value={editingDuel.prompt}
                  onChange={(e) => setEditingDuel({...editingDuel, prompt: e.target.value})}
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
                    marginBottom: '20px'
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)', display: 'block', marginBottom: '8px' }}>
                    Start Date
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
                  <label style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)', display: 'block', marginBottom: '8px' }}>
                    End Date
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)', display: 'block', marginBottom: '8px' }}>
                    Voting Start
                  </label>
                  <input
                    type="datetime-local"
                    value={editingDuel.end_date}
                    onChange={(e) => setEditingDuel({...editingDuel, voting_start: e.target.value})}
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
                  <label style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)', display: 'block', marginBottom: '8px' }}>
                    Voting End
                  </label>
                  <input
                    type="datetime-local"
                    value={new Date(new Date(editingDuel.end_date).getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                    onChange={(e) => setEditingDuel({...editingDuel, voting_end: e.target.value})}
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)', display: 'block', marginBottom: '8px' }}>
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
            // View Mode - Show all information by default
            <div>
              {/* Duel Information Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '24px', 
                marginBottom: '32px',
                padding: '24px',
                borderRadius: '12px',
                background: 'var(--surface)',
                border: '1px solid var(--border)'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</div>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    fontFamily: 'var(--font-display)', 
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '6px',
                    background: getStatusColor(selectedDuel.status),
                    display: 'inline-block'
                  }}>
                    {getStatusText(selectedDuel.status)}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Start Date</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                    {formatDate(selectedDuel.start_date)} at {formatTime(selectedDuel.start_date)}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>End Date</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                    {formatDate(selectedDuel.end_date)} at {formatTime(selectedDuel.end_date)}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Voting Period</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                    {formatDate(selectedDuel.end_date)} at {formatTime(selectedDuel.end_date)} - 
                    {formatDate(new Date(new Date(selectedDuel.end_date).getTime() + 24 * 60 * 60 * 1000).toISOString())} at {formatTime(new Date(new Date(selectedDuel.end_date).getTime() + 24 * 60 * 60 * 1000).toISOString())}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginTop: '4px' }}>
                    Duration: 24 hours
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Submission Window</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                    {formatDate(selectedDuel.start_date)} at {formatTime(selectedDuel.start_date)} - 
                    {formatDate(selectedDuel.end_date)} at {formatTime(selectedDuel.end_date)}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginTop: '4px' }}>
                    ~6 days
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time Zone</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                    Eastern Time (EST)
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Prizes Distributed</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                    {selectedDuel.prize_distributed ? 'Yes' : 'No'}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Submissions</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                    {duelSubmissions.length}
                  </div>
                </div>
              </div>

              {/* Full Prompt */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '16px' }}>
                  Full Prompt
                </h3>
                <div style={{ 
                  padding: '20px', 
                  borderRadius: '12px', 
                  background: 'var(--surface)', 
                  border: '1px solid var(--border)',
                  fontSize: '16px',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--text)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6'
                }}>
                  {selectedDuel.prompt}
                </div>
              </div>

              {/* Voting Leaderboard */}
              {selectedDuel.status === 'voting' && duelSubmissions.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '16px' }}>
                    Live Voting Leaderboard
                  </h3>
                  <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border)' }}>
                    {duelSubmissions.map((submission, index) => (
                      <div key={submission.id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '16px 0',
                        borderBottom: index < duelSubmissions.length - 1 ? '1px solid var(--border)' : 'none'
                      }}>
                        <div style={{ flex: 1, marginRight: '20px' }}>
                          <div style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '8px' }}>
                            #{index + 1} {submission.username}
                          </div>
                          <div style={{ fontSize: '14px', color: 'var(--text2)', fontFamily: 'var(--font-body)', lineHeight: '1.4' }}>
                            {submission.content.substring(0, 150)}{submission.content.length > 150 ? '...' : ''}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', minWidth: '120px' }}>
                          <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--purple)' }}>
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

              
              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                <button
                  onClick={() => setEditingDuel(selectedDuel)}
                  className="btn-cta-ghost"
                  style={{ padding: '12px 24px' }}
                >
                  Edit Duel
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn-cta-danger"
                  style={{ padding: '12px 24px' }}
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
