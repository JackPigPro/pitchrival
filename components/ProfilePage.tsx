'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import CountryDropdown from './CountryDropdown'

interface Profile {
  id: string
  username: string
  location?: string
  bio?: string
  stage?: string
  skills?: string[]
  status_tags?: string[]
  social_links?: {
    x?: string
    linkedin?: string
    github?: string
  }
  created_at: string
}

interface UserStats {
  elo?: number
  leaderboard_rank?: number
}

interface Idea {
  id: string
  title: string
  description: string
  created_at: string
}

interface ProfilePageProps {
  profile: Profile
  userStats?: UserStats
  ideas: Idea[]
  isOwnProfile: boolean
}

export default function ProfilePage({ profile: initialProfile, userStats, ideas, isOwnProfile }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [currentProfile, setCurrentProfile] = useState(initialProfile)
  const [editData, setEditData] = useState({
    username: initialProfile.username || '',
    location: initialProfile.location || '',
    bio: initialProfile.bio || '',
    stage: initialProfile.stage || '',
    skills: initialProfile.skills || [],
    status_tags: initialProfile.status_tags || [],
    social_links: initialProfile.social_links || {}
  })

  const supabase = createClient()

  const handleSave = async () => {
    setLoading(true)
    setSaveSuccess(false)
    try {
      // Get the authenticated user's ID from Supabase auth
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username: editData.username.toLowerCase(),
          location: editData.location,
          bio: editData.bio,
          stage: editData.stage,
          skills: editData.skills,
          status_tags: editData.status_tags,
          social_links: {
            x: editData.social_links.x,
            linkedin: editData.social_links.linkedin,
            github: editData.social_links.github
          }
        })
        .eq('id', user.id)

      if (error) throw error
      
      // Update local state with saved data
      const updatedProfile = {
        ...currentProfile,
        id: user.id, // Ensure we have the correct user ID
        username: editData.username.toLowerCase(),
        location: editData.location,
        bio: editData.bio,
        stage: editData.stage,
        skills: editData.skills,
        status_tags: editData.status_tags,
        social_links: editData.social_links
      }
      setCurrentProfile(updatedProfile)
      setSaveSuccess(true)
      setTimeout(() => {
        setIsEditing(false)
        setSaveSuccess(false)
      }, 1000)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error saving profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleSkill = (skill: string) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const toggleStatusTag = (tag: string) => {
    setEditData(prev => ({
      ...prev,
      status_tags: prev.status_tags.includes(tag)
        ? prev.status_tags.filter(t => t !== tag)
        : [...prev.status_tags, tag]
    }))
  }

  const getProfileColor = (username: string) => {
    const colors = ['#16a34a', '#2563eb', '#7c3aed', '#dc2626', '#ca8a04']
    let hash = 0
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  const stageOptions = ['Idea Stage', 'Building MVP', 'Already Launched']
  const skillOptions = ['Design', 'Code', 'Marketing', 'Sales', 'Finance']
  const statusTagOptions = ['Looking for Co-founder', 'Open to be a Co-founder', 'Message me for ideas', 'Open to feedback']

  if (isEditing) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: '16px', 
            padding: '32px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
              Edit Profile
            </h2>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Username
                </label>
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border2)',
                    background: 'var(--card2)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Location
                </label>
                <CountryDropdown
                  value={editData.location}
                  onChange={(value) => setEditData(prev => ({ ...prev, location: value }))}
                  placeholder="Select country"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Bio
                </label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border2)',
                    background: 'var(--card2)',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Stage
                </label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {stageOptions.map(stage => (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => setEditData(prev => ({ ...prev, stage }))}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: `1px solid ${editData.stage === stage ? 'var(--green)' : 'var(--border2)'}`,
                        background: editData.stage === stage ? 'var(--green-tint)' : 'var(--card2)',
                        color: editData.stage === stage ? 'var(--green)' : 'var(--text2)',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Skills
                </label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {skillOptions.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: `1px solid ${editData.skills.includes(skill) ? 'var(--blue)' : 'var(--border2)'}`,
                        background: editData.skills.includes(skill) ? 'var(--blue-tint)' : 'var(--card2)',
                        color: editData.skills.includes(skill) ? 'var(--blue)' : 'var(--text2)',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Status Tags
                </label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {statusTagOptions.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleStatusTag(tag)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: `1px solid ${editData.status_tags.includes(tag) ? 'var(--purple)' : 'var(--border2)'}`,
                        background: editData.status_tags.includes(tag) ? 'var(--purple-tint)' : 'var(--card2)',
                        color: editData.status_tags.includes(tag) ? 'var(--purple)' : 'var(--text2)',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Social Links
                </label>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="X username"
                    value={editData.social_links.x || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      social_links: { ...prev.social_links, x: e.target.value }
                    }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border2)',
                      background: 'var(--card2)',
                      fontSize: '14px'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="LinkedIn username"
                    value={editData.social_links.linkedin || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      social_links: { ...prev.social_links, linkedin: e.target.value }
                    }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border2)',
                      background: 'var(--card2)',
                      fontSize: '14px'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="GitHub username"
                    value={editData.social_links.github || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      social_links: { ...prev.social_links, github: e.target.value }
                    }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border2)',
                      background: 'var(--card2)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: '1px solid var(--border2)',
                    background: 'var(--card2)',
                    color: 'var(--text)',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || saveSuccess}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: saveSuccess ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'var(--green)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: loading || saveSuccess ? 'not-allowed' : 'pointer',
                    opacity: loading || saveSuccess ? 0.9 : 1,
                    transition: 'all 0.2s ease',
                    boxShadow: saveSuccess ? '0 4px 12px rgba(34,197,94,0.4)' : 'var(--shadow-md)',
                    transform: saveSuccess ? 'scale(0.98)' : 'scale(1)'
                  }}
                >
                  {saveSuccess ? '✓ Saved!' : loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
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
      padding: '24px' 
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Profile Header */}
        <div style={{ 
          background: 'var(--card)', 
          borderRadius: '16px', 
          padding: '40px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px', marginBottom: '32px' }}>
            {/* Profile Picture */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${getProfileColor(currentProfile.username)}, ${getProfileColor(currentProfile.username)}dd)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '48px',
              fontWeight: '800',
              fontFamily: 'var(--font-display)',
              flexShrink: 0,
              boxShadow: 'var(--shadow-lg)',
              border: '3px solid var(--card)',
              position: 'relative',
              zIndex: 1
            }}>
              {currentProfile.username.charAt(0).toUpperCase()}
            </div>

            {/* Profile Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                <h1 style={{ 
                  fontSize: '36px', 
                  fontWeight: '800', 
                  fontFamily: 'var(--font-display)', 
                  margin: 0, 
                  color: 'var(--text)',
                  letterSpacing: '-1px'
                }}>
                  {currentProfile.username}
                </h1>
                {currentProfile.stage && (
                  <span style={{
                    padding: '6px 16px',
                    borderRadius: '20px',
                    background: 'var(--green-tint)',
                    color: 'var(--green)',
                    fontSize: '13px',
                    fontWeight: '700',
                    fontFamily: 'var(--font-display)',
                    border: '1px solid rgba(21,128,61,.2)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {currentProfile.stage}
                  </span>
                )}
              </div>
              
              {currentProfile.location && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '16px',
                  color: 'var(--text2)',
                  fontSize: '15px',
                  fontWeight: '500'
                }}>
                  <span style={{ fontSize: '16px' }}>📍</span>
                  {currentProfile.location}
                </div>
              )}

              {currentProfile.bio && (
                <div style={{ 
                  color: 'var(--text)', 
                  fontSize: '16px', 
                  lineHeight: '1.7', 
                  marginBottom: '20px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: '400'
                }}>
                  {currentProfile.bio}
                </div>
              )}

              {/* Skills and Status Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                {currentProfile.skills?.map(skill => (
                  <span 
                    key={skill} 
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      background: 'var(--blue-tint)',
                      color: 'var(--blue)',
                      fontSize: '13px',
                      fontWeight: '700',
                      fontFamily: 'var(--font-display)',
                      border: '1px solid rgba(37,99,235,.2)',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.2s ease',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--blue)'
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = 'var(--shadow)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--blue-tint)'
                      e.currentTarget.style.color = 'var(--blue)'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                    }}
                  >
                    {skill}
                  </span>
                ))}
                {currentProfile.status_tags?.map(tag => (
                  <span 
                    key={tag} 
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      background: 'var(--purple-tint)',
                      color: 'var(--purple)',
                      fontSize: '13px',
                      fontWeight: '700',
                      fontFamily: 'var(--font-display)',
                      border: '1px solid rgba(124,58,237,.2)',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.2s ease',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--purple)'
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = 'var(--shadow)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--purple-tint)'
                      e.currentTarget.style.color = 'var(--purple)'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Social Links */}
              {currentProfile.social_links && Object.keys(currentProfile.social_links).length > 0 && (
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  {currentProfile.social_links.x && (
                    <a 
                      href={`https://x.com/${currentProfile.social_links.x}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'var(--card2)',
                        border: '1px solid var(--border2)',
                        color: 'var(--text2)',
                        textDecoration: 'none',
                        fontSize: '18px',
                        fontWeight: '700',
                        transition: 'all 0.2s ease',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#000'
                        e.currentTarget.style.color = '#fff'
                        e.currentTarget.style.borderColor = '#000'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = 'var(--shadow)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--card2)'
                        e.currentTarget.style.color = 'var(--text2)'
                        e.currentTarget.style.borderColor = 'var(--border2)'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                      }}
                    >
                      𝕏
                    </a>
                  )}
                  {currentProfile.social_links.linkedin && (
                    <a 
                      href={`https://linkedin.com/in/${currentProfile.social_links.linkedin}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'var(--card2)',
                        border: '1px solid var(--border2)',
                        color: 'var(--text2)',
                        textDecoration: 'none',
                        fontSize: '18px',
                        fontWeight: '700',
                        transition: 'all 0.2s ease',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#0077b5'
                        e.currentTarget.style.color = '#fff'
                        e.currentTarget.style.borderColor = '#0077b5'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = 'var(--shadow)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--card2)'
                        e.currentTarget.style.color = 'var(--text2)'
                        e.currentTarget.style.borderColor = 'var(--border2)'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                      }}
                    >
                      in
                    </a>
                  )}
                  {currentProfile.social_links.github && (
                    <a 
                      href={`https://github.com/${currentProfile.social_links.github}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'var(--card2)',
                        border: '1px solid var(--border2)',
                        color: 'var(--text2)',
                        textDecoration: 'none',
                        fontSize: '18px',
                        fontWeight: '700',
                        transition: 'all 0.2s ease',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#333'
                        e.currentTarget.style.color = '#fff'
                        e.currentTarget.style.borderColor = '#333'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = 'var(--shadow)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--card2)'
                        e.currentTarget.style.color = 'var(--text2)'
                        e.currentTarget.style.borderColor = 'var(--border2)'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                      }}
                    >
                      ⚡
                    </a>
                  )}
                </div>
              )}

              {/* Edit Button */}
              {isOwnProfile && (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    border: '1px solid var(--border2)',
                    background: 'var(--card2)',
                    color: 'var(--text)',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'var(--font-display)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-sm)',
                    letterSpacing: '-0.1px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--green)'
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.borderColor = 'var(--green)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = 'var(--shadow)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--card2)'
                    e.currentTarget.style.color = 'var(--text)'
                    e.currentTarget.style.borderColor = 'var(--border2)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                  }}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
            gap: '16px', 
            paddingTop: '24px', 
            borderTop: '1px solid var(--border)' 
          }}>
            {userStats?.elo && (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                borderRadius: '12px', 
                background: 'var(--card2)', 
                transition: 'all 0.2s ease',
                border: '1px solid var(--border2)',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--green-tint)'
                e.currentTarget.style.borderColor = 'var(--green)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--card2)'
                e.currentTarget.style.borderColor = 'var(--border2)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: '800', 
                  color: 'var(--green)', 
                  fontFamily: 'var(--font-display)',
                  marginBottom: '4px'
                }}>
                  {userStats.elo}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: 'var(--text2)',
                  fontWeight: '600',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.5px'
                }}>ELO RATING</div>
              </div>
            )}
            {userStats?.leaderboard_rank && (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                borderRadius: '12px', 
                background: 'var(--card2)', 
                transition: 'all 0.2s ease',
                border: '1px solid var(--border2)',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--blue-tint)'
                e.currentTarget.style.borderColor = 'var(--blue)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--card2)'
                e.currentTarget.style.borderColor = 'var(--border2)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: '800', 
                  color: 'var(--blue)', 
                  fontFamily: 'var(--font-display)',
                  marginBottom: '4px'
                }}>
                  #{userStats.leaderboard_rank}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: 'var(--text2)',
                  fontWeight: '600',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.5px'
                }}>RANK</div>
              </div>
            )}
            <div style={{ 
              textAlign: 'center', 
              padding: '20px', 
              borderRadius: '12px', 
              background: 'var(--card2)', 
              transition: 'all 0.2s ease',
              border: '1px solid var(--border2)',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--purple-tint)'
              e.currentTarget.style.borderColor = 'var(--purple)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = 'var(--shadow)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--card2)'
              e.currentTarget.style.borderColor = 'var(--border2)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '800', 
                color: 'var(--purple)', 
                fontFamily: 'var(--font-display)',
                marginBottom: '4px'
              }}>
                {ideas.length}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--text2)',
                fontWeight: '600',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.5px'
              }}>IDEAS</div>
            </div>
            <div style={{ 
              textAlign: 'center', 
              padding: '20px', 
              borderRadius: '12px', 
              background: 'var(--card2)', 
              transition: 'all 0.2s ease',
              border: '1px solid var(--border2)',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--gold-tint)'
              e.currentTarget.style.borderColor = 'var(--gold)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = 'var(--shadow)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--card2)'
              e.currentTarget.style.borderColor = 'var(--border2)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: '800', 
                color: 'var(--gold)', 
                fontFamily: 'var(--font-display)',
                marginBottom: '4px'
              }}>
                {new Date(currentProfile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--text2)',
                fontWeight: '600',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.5px'
              }}>JOINED</div>
            </div>
          </div>
        </div>

        {/* Co-founder Match Button */}
        <div style={{ 
          background: 'var(--card)', 
          borderRadius: '16px', 
          padding: '32px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, var(--blue), var(--green), var(--purple))',
            opacity: 0.8
          }} />
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            fontFamily: 'var(--font-display)',
            color: 'var(--text)',
            marginBottom: '16px',
            letterSpacing: '-0.2px'
          }}>
            Looking for a co-founder?
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'var(--text2)',
            marginBottom: '24px',
            lineHeight: '1.6'
          }}>
            Find your perfect match based on skills, goals, and compatibility
          </p>
          <a 
            href="/connect"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--blue), #3b82f6)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '700',
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow)',
              letterSpacing: '-0.1px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #1d4ed8, var(--blue))'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, var(--blue), #3b82f6)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'var(--shadow)'
            }}
          >
            <span>🤝</span>
            View Co-founder Matches
            <span style={{ fontSize: '16px' }}>→</span>
          </a>
        </div>

        {/* Ideas Section */}
        {ideas.length > 0 && (
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: '16px', 
            padding: '32px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                fontFamily: 'var(--font-display)', 
                color: 'var(--text)',
                letterSpacing: '-0.3px',
                margin: 0
              }}>
                💡 Public Ideas
              </h2>
              <span style={{
                fontSize: '13px',
                color: 'var(--text2)',
                fontWeight: '600',
                fontFamily: 'var(--font-display)',
                background: 'var(--card2)',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border2)'
              }}>
                {ideas.length} {ideas.length === 1 ? 'Idea' : 'Ideas'}
              </span>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              {ideas.map(idea => (
                <div 
                  key={idea.id} 
                  style={{
                    padding: '24px',
                    borderRadius: '12px',
                    background: 'var(--card2)',
                    border: '1px solid var(--border2)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--card)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--card2)'
                    e.currentTarget.style.borderColor = 'var(--border2)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, var(--purple), #a855f7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: '700',
                      fontFamily: 'var(--font-display)',
                      flexShrink: 0
                    }}>
                      💡
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '700', 
                        marginBottom: '8px', 
                        fontFamily: 'var(--font-display)', 
                        color: 'var(--text)',
                        letterSpacing: '-0.2px',
                        margin: 0
                      }}>
                        {idea.title}
                      </h3>
                      <p style={{ 
                        color: 'var(--text2)', 
                        fontSize: '14px', 
                        lineHeight: '1.6', 
                        marginBottom: '16px',
                        margin: '0 0 16px 0'
                      }}>
                        {idea.description}
                      </p>
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px', 
                    color: 'var(--text3)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: '500'
                  }}>
                    <span>
                      📅 {new Date(idea.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span style={{
                      background: 'var(--purple-tint)',
                      color: 'var(--purple)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      fontFamily: 'var(--font-display)'
                    }}>
                      PUBLIC
                    </span>
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
