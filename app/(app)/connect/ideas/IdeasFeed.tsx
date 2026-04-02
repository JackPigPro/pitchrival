'use client'

import { useState } from 'react'
import Link from 'next/link'
import { IdeaWithDetails, SortOption } from '@/types/database'

interface IdeasFeedProps {
  ideas: IdeaWithDetails[]
  onIdeaClick: (idea: IdeaWithDetails) => void
  onIdeaUpdate: (idea: IdeaWithDetails) => void
  onIdeaDelete: (ideaId: string) => void
  onSortChange: (sort: SortOption) => void
  currentUserId: string
}

export default function IdeasFeed({ 
  ideas, 
  onIdeaClick, 
  onIdeaUpdate, 
  onIdeaDelete, 
  onSortChange,
  currentUserId 
}: IdeasFeedProps) {
  const [currentSort, setCurrentSort] = useState<SortOption>('latest')

  const handleSortChange = (sort: SortOption) => {
    setCurrentSort(sort)
    onSortChange(sort)
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`
    return `${Math.floor(diffInSeconds / 2592000)} months ago`
  }

  const truncateContent = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  const handleDelete = async (ideaId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this idea? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/connect/ideas/api/ideas/${ideaId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete idea')
      }

      onIdeaDelete(ideaId)
    } catch (err) {
      console.error('Error deleting idea:', err)
      alert('Failed to delete idea. Please try again.')
    }
  }

  const handleEdit = (idea: IdeaWithDetails, e: React.MouseEvent) => {
    e.stopPropagation()
    onIdeaClick(idea)
  }

  return (
    <div>
      {/* Filter bar */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        padding: '16px',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
      }}>
        <button
          onClick={() => handleSortChange('latest')}
          style={{
            padding: '8px 16px',
            background: currentSort === 'latest' ? 'var(--green)' : 'var(--card2)',
            color: currentSort === 'latest' ? 'white' : 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
          }}
        >
          Latest
        </button>
        <button
          onClick={() => handleSortChange('most_liked')}
          style={{
            padding: '8px 16px',
            background: currentSort === 'most_liked' ? 'var(--green)' : 'var(--card2)',
            color: currentSort === 'most_liked' ? 'white' : 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
          }}
        >
          Most Liked
        </button>
      </div>

      {/* Ideas grid */}
      {ideas.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 700,
            marginBottom: '12px',
            fontFamily: 'var(--font-display)',
            color: 'var(--text)',
          }}>
            No ideas yet
          </h3>
          <p style={{ color: 'var(--text2)', fontSize: '16px' }}>
            Be the first to post an idea!
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
        }}>
          {ideas.map((idea) => (
            <div
              key={idea.id}
              onClick={() => onIdeaClick(idea)}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--green)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Owner controls */}
              {idea.user_id === currentUserId && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  display: 'flex',
                  gap: '8px',
                }}>
                  <button
                    onClick={(e) => handleEdit(idea, e)}
                    style={{
                      padding: '4px 8px',
                      background: 'var(--blue)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(idea.id, e)}
                    style={{
                      padding: '4px 8px',
                      background: 'var(--red)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* Title */}
              <h3 style={{
                fontSize: '16px',
                fontWeight: 700,
                marginBottom: '8px',
                fontFamily: 'var(--font-display)',
                color: 'var(--text)',
                lineHeight: 1.3,
                paddingRight: idea.user_id === currentUserId ? '100px' : '0',
              }}>
                {idea.title}
              </h3>

              {/* Content preview */}
              <p style={{
                fontSize: '14px',
                color: 'var(--text2)',
                marginBottom: '16px',
                lineHeight: 1.5,
              }}>
                {truncateContent(idea.content)}
              </p>

              {/* Author */}
              <div style={{ marginBottom: '12px' }}>
                <Link
                  href={`/profile/${idea.profiles.username}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    fontSize: '13px',
                    color: 'var(--blue)',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none'
                  }}
                >
                  @{idea.profiles.username}
                </Link>
              </div>

              {/* Stats */}
              <div style={{
                display: 'flex',
                gap: '16px',
                fontSize: '13px',
                color: 'var(--text3)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>👍</span>
                  <span>{idea._count?.idea_likes || 0}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>💬</span>
                  <span>{idea._count?.idea_comments || 0}</span>
                </div>
                <div>
                  {formatTimeAgo(idea.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
