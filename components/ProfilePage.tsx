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

export default function ProfilePage({ profile, userStats, ideas, isOwnProfile }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentProfile, setCurrentProfile] = useState(profile)
  const [editData, setEditData] = useState({
    username: currentProfile.username || '',
    location: currentProfile.location || '',
    bio: currentProfile.bio || '',
    stage: currentProfile.stage || '',
    skills: currentProfile.skills || [],
    status_tags: currentProfile.status_tags || [],
    social_links: currentProfile.social_links || {}
  })

  const supabase = createClient()

  const handleSave = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: editData.username.toLowerCase(),
          location: editData.location,
          bio: editData.bio,
          stage: editData.stage,
          skills: editData.skills,
          status_tags: editData.status_tags,
          social_links: editData.social_links
        })
        .eq('id', profile.id)

      if (error) throw error
      
      // Update local state with saved data
      const updatedProfile = {
        ...profile,
        username: editData.username.toLowerCase(),
        location: editData.location,
        bio: editData.bio,
        stage: editData.stage,
        skills: editData.skills,
        status_tags: editData.status_tags,
        social_links: editData.social_links
      }
      setCurrentProfile(updatedProfile)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
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
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--green)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Profile Header */}
        <div style={{ 
          background: 'var(--card)', 
          borderRadius: '16px', 
          padding: '32px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '24px' }}>
            {/* Profile Picture */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: getProfileColor(currentProfile.username),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '32px',
              fontWeight: '700',
              fontFamily: 'var(--font-display)',
              flexShrink: 0
            }}>
              {currentProfile.username.charAt(0).toUpperCase()}
            </div>

            {/* Profile Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-display)', margin: 0 }}>
                  {currentProfile.username}
                </h1>
                {profile.stage && (
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    background: 'var(--green-tint)',
                    color: 'var(--green)',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {currentProfile.stage}
                  </span>
                )}
              </div>
              
              {profile.location && (
                <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '12px' }}>
                  📍 {currentProfile.location}
                </p>
              )}

              {profile.bio && (
                <p style={{ color: 'var(--text)', fontSize: '15px', lineHeight: '1.6', marginBottom: '16px' }}>
                  {currentProfile.bio}
                </p>
              )}

              {/* Skills and Status Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                {currentProfile.skills?.map(skill => (
                  <span key={skill} style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    background: 'var(--blue-tint)',
                    color: 'var(--blue)',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {skill}
                  </span>
                ))}
                {currentProfile.status_tags?.map(tag => (
                  <span key={tag} style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    background: 'var(--purple-tint)',
                    color: 'var(--purple)',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Social Links */}
              {currentProfile.social_links && Object.keys(currentProfile.social_links).length > 0 && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  {currentProfile.social_links.x && (
                    <a href={`https://x.com/${currentProfile.social_links.x}`} target="_blank" rel="noopener noreferrer"
                       style={{ color: 'var(--text2)', textDecoration: 'none', fontSize: '18px' }}>𝕏</a>
                  )}
                  {currentProfile.social_links.linkedin && (
                    <a href={`https://linkedin.com/in/${currentProfile.social_links.linkedin}`} target="_blank" rel="noopener noreferrer"
                       style={{ color: 'var(--text2)', textDecoration: 'none', fontSize: '18px' }}>in</a>
                  )}
                  {currentProfile.social_links.github && (
                    <a href={`https://github.com/${profile.social_links.github}`} target="_blank" rel="noopener noreferrer"
                       style={{ color: 'var(--text2)', textDecoration: 'none', fontSize: '18px' }}>⚡</a>
                  )}
                </div>
              )}

              {/* Edit Button */}
              {isOwnProfile && (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border2)',
                    background: 'var(--card2)',
                    color: 'var(--text)',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            {userStats?.elo && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--green)', fontFamily: 'var(--font-display)' }}>
                  {userStats.elo}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text2)' }}>ELO Rating</div>
              </div>
            )}
            {userStats?.leaderboard_rank && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  #{userStats.leaderboard_rank}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text2)' }}>Leaderboard Rank</div>
              </div>
            )}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--blue)', fontFamily: 'var(--font-display)' }}>
                {ideas.length}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text2)' }}>Ideas</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--purple)', fontFamily: 'var(--font-display)' }}>
                {new Date(currentProfile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text2)' }}>Joined</div>
            </div>
          </div>
        </div>

        {/* Co-founder Match Button */}
        <div style={{ 
          background: 'var(--card)', 
          borderRadius: '16px', 
          padding: '24px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <a 
            href="/connect"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              borderRadius: '8px',
              background: 'var(--green)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            View Co-founder Match →
          </a>
        </div>

        {/* Ideas Section */}
        {ideas.length > 0 && (
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: '16px', 
            padding: '32px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
              Public Ideas
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {ideas.map(idea => (
                <div key={idea.id} style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'var(--card2)',
                  border: '1px solid var(--border2)'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
                    {idea.title}
                  </h3>
                  <p style={{ color: 'var(--text2)', fontSize: '14px', lineHeight: '1.6' }}>
                    {idea.description}
                  </p>
                  <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text3)' }}>
                    {new Date(idea.created_at).toLocaleDateString()}
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
