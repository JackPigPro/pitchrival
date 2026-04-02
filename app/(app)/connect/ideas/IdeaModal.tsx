'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { IdeaWithDetails, CommentWithProfile } from '@/types/database'

interface IdeaModalProps {
  idea: IdeaWithDetails
  onClose: () => void
  onUpdate: (idea: IdeaWithDetails) => void
  onDelete: (ideaId: string) => void
  currentUserId: string
}

export default function IdeaModal({ idea, onClose, onUpdate, onDelete, currentUserId }: IdeaModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(idea.title)
  const [editContent, setEditContent] = useState(idea.content)
  const [editIsPublic, setEditIsPublic] = useState(idea.is_public)
  const [editing, setEditing] = useState(false)
  const [comments, setComments] = useState<CommentWithProfile[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editCommentContent, setEditCommentContent] = useState('')
  const [likeCount, setLikeCount] = useState(idea._count?.idea_likes || 0)
  const [isLiked, setIsLiked] = useState(idea.idea_likes?.some(like => like.user_id === currentUserId) || false)
  const [loadingComments, setLoadingComments] = useState(true)
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [idea.id])

  const fetchComments = async () => {
    try {
      setLoadingComments(true)
      const response = await fetch(`/connect/ideas/api/ideas/${idea.id}/comments`)
      if (response.ok) {
        const { data } = await response.json()
        setComments(data || [])
      }
    } catch (err) {
      console.error('Error fetching comments:', err)
    } finally {
      setLoadingComments(false)
    }
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

  const handleLike = async () => {
    try {
      const response = await fetch('/connect/ideas/api/ideas/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea_id: idea.id }),
      })

      if (response.ok) {
        const { liked } = await response.json()
        setIsLiked(liked)
        setLikeCount(prev => liked ? prev + 1 : prev - 1)
      }
    } catch (err) {
      console.error('Error toggling like:', err)
    }
  }

  const handleEdit = async () => {
    try {
      setEditing(true)
      
      console.log('Updating idea:', idea.id, {
        title: editTitle.trim(),
        content: editContent.trim(),
        is_public: editIsPublic,
      })
      
      const response = await fetch(`/connect/ideas/api/ideas/${idea.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editContent.trim(),
          is_public: editIsPublic,
        }),
      })

      console.log('Response status:', response.status)
      
      if (response.ok) {
        const { data } = await response.json()
        console.log('Updated idea data:', data)
        onUpdate(data)
        setIsEditing(false)
      } else {
        const errorData = await response.json()
        console.error('Failed to update idea:', errorData)
        throw new Error(errorData.error || 'Failed to update idea')
      }
    } catch (err) {
      console.error('Error updating idea:', err)
      alert(`Failed to update idea: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setEditing(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this idea? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/connect/ideas/api/ideas/${idea.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onDelete(idea.id)
        onClose()
      } else {
        throw new Error('Failed to delete idea')
      }
    } catch (err) {
      console.error('Error deleting idea:', err)
      alert('Failed to delete idea. Please try again.')
    }
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return

    try {
      setSubmittingComment(true)
      
      console.log('Submitting comment for idea:', idea.id)
      console.log('Comment content:', newComment.trim())
      
      const response = await fetch(`/connect/ideas/api/ideas/${idea.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment.trim() }),
      })

      console.log('Comment response status:', response.status)

      if (response.ok) {
        const { data } = await response.json()
        console.log('Comment submitted successfully:', data)
        setComments(prev => [...prev, data])
        setNewComment('')
      } else {
        const errorData = await response.json()
        console.error('Failed to submit comment:', errorData)
        alert(`Failed to submit comment: ${errorData.error || 'Unknown error'}`)
      }
    } catch (err) {
      console.error('Error submitting comment:', err)
      alert(`Failed to submit comment: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleReplySubmit = async (parentId: string) => {
    if (!replyContent.trim()) return

    try {
      const response = await fetch(`/connect/ideas/api/ideas/${idea.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: replyContent.trim(),
          parent_id: parentId,
        }),
      })

      if (response.ok) {
        const { data } = await response.json()
        
        // Add reply to the correct parent comment
        const addToParent = (comments: CommentWithProfile[]): CommentWithProfile[] => {
          return comments.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), data]
              }
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: addToParent(comment.replies)
              }
            }
            return comment
          })
        }
        
        setComments(prev => addToParent(prev))
        setReplyContent('')
        setReplyingTo(null)
      }
    } catch (err) {
      console.error('Error submitting reply:', err)
      alert('Failed to submit reply. Please try again.')
    }
  }

  const handleCommentEdit = async (commentId: string) => {
    if (!editCommentContent.trim()) return

    try {
      const response = await fetch(`/connect/ideas/api/ideas/${idea.id}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editCommentContent.trim() }),
      })

      if (response.ok) {
        const { data } = await response.json()
        
        // Update comment in the tree
        const updateComment = (comments: CommentWithProfile[]): CommentWithProfile[] => {
          return comments.map(comment => {
            if (comment.id === commentId) {
              return data
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateComment(comment.replies)
              }
            }
            return comment
          })
        }
        
        setComments(prev => updateComment(prev))
        setEditingComment(null)
        setEditCommentContent('')
      }
    } catch (err) {
      console.error('Error editing comment:', err)
      alert('Failed to edit comment. Please try again.')
    }
  }

  const handleCommentDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const response = await fetch(`/connect/ideas/api/ideas/${idea.id}/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove comment from the tree
        const removeComment = (comments: CommentWithProfile[]): CommentWithProfile[] => {
          return comments.filter(comment => comment.id !== commentId).map(comment => {
            if (comment.replies) {
              return {
                ...comment,
                replies: removeComment(comment.replies)
              }
            }
            return comment
          })
        }
        
        setComments(prev => removeComment(prev))
      }
    } catch (err) {
      console.error('Error deleting comment:', err)
      alert('Failed to delete comment. Please try again.')
    }
  }

  const renderComments = (comments: CommentWithProfile[], depth = 0) => {
    return comments.map(comment => (
      <div key={comment.id} style={{ marginLeft: depth * 20, marginBottom: '12px' }}>
        <div style={{
          background: 'var(--card2)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '12px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <Link
              href={`/profile/${comment.profiles.username}`}
              style={{
                fontSize: '13px',
                color: 'var(--blue)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              @{comment.profiles.username}
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text3)' }}>
                {formatTimeAgo(comment.created_at)}
              </span>
              {comment.edited_at && (
                <span style={{ fontSize: '11px', color: 'var(--text3)' }}>
                  (edited {formatTimeAgo(comment.edited_at)})
                </span>
              )}
              {comment.user_id === currentUserId && (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => {
                      setEditingComment(comment.id)
                      setEditCommentContent(comment.content)
                    }}
                    style={{
                      padding: '2px 6px',
                      background: 'var(--blue)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      fontSize: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleCommentDelete(comment.id)}
                    style={{
                      padding: '2px 6px',
                      background: 'var(--red)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      fontSize: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {editingComment === comment.id ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <textarea
                value={editCommentContent}
                onChange={(e) => setEditCommentContent(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '60px',
                  padding: '8px',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-body)',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleCommentEdit(comment.id)}
                  style={{
                    padding: '6px 12px',
                    background: 'var(--green)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingComment(null)
                    setEditCommentContent('')
                  }}
                  style={{
                    padding: '6px 12px',
                    background: 'var(--border)',
                    color: 'var(--text)',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '14px', color: 'var(--text)', marginBottom: '8px', lineHeight: 1.4 }}>
              {comment.content}
            </p>
          )}

          {replyingTo === comment.id ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                style={{
                  width: '100%',
                  minHeight: '60px',
                  padding: '8px',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-body)',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleReplySubmit(comment.id)}
                  style={{
                    padding: '6px 12px',
                    background: 'var(--green)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Reply
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(null)
                    setReplyContent('')
                  }}
                  style={{
                    padding: '6px 12px',
                    background: 'var(--border)',
                    color: 'var(--text)',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setReplyingTo(comment.id)}
              style={{
                padding: '4px 8px',
                background: 'var(--card)',
                color: 'var(--text2)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              Reply
            </button>
          )}
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            {renderComments(comment.replies, depth + 1)}
          </div>
        )}
      </div>
    ))
  }

  return (
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
      zIndex: 1000,
      padding: '20px',
    }}>
      <div style={{
        background: 'var(--card)',
        borderRadius: '16px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 700,
            margin: 0,
            fontFamily: 'var(--font-display)',
            color: 'var(--text)',
          }}>
            {isEditing ? 'Edit Idea' : 'Idea Details'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--text3)',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left panel - Idea content */}
          <div style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
            borderRight: '1px solid var(--border)',
          }}>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                  }}
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '200px',
                    padding: '12px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'var(--font-body)',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    resize: 'vertical',
                  }}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={editIsPublic}
                    onChange={(e) => setEditIsPublic(e.target.checked)}
                  />
                  <span style={{ fontSize: '14px', color: 'var(--text2)' }}>
                    Public (everyone can see)
                  </span>
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleEdit}
                    disabled={editing}
                    style={{
                      padding: '12px 24px',
                      background: editing ? 'var(--border)' : 'var(--green)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: editing ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {editing ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setEditTitle(idea.title)
                      setEditContent(idea.content)
                      setEditIsPublic(idea.is_public)
                    }}
                    style={{
                      padding: '12px 24px',
                      background: 'var(--border)',
                      color: 'var(--text)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1 style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  marginBottom: '16px',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text)',
                  lineHeight: 1.3,
                }}>
                  {idea.title}
                </h1>

                <div style={{ marginBottom: '16px' }}>
                  <Link
                    href={`/profile/${idea.profiles.username}`}
                    style={{
                      fontSize: '14px',
                      color: 'var(--blue)',
                      textDecoration: 'none',
                      fontWeight: 500,
                    }}
                  >
                    @{idea.profiles.username}
                  </Link>
                  <span style={{ margin: '0 8px', color: 'var(--text3)' }}>•</span>
                  <span style={{ fontSize: '14px', color: 'var(--text3)' }}>
                    {formatTimeAgo(idea.created_at)}
                  </span>
                  {idea.edited_at && (
                    <>
                      <span style={{ margin: '0 8px', color: 'var(--text3)' }}>•</span>
                      <span style={{ fontSize: '14px', color: 'var(--text3)' }}>
                        edited {formatTimeAgo(idea.edited_at)}
                      </span>
                    </>
                  )}
                </div>

                <div style={{
                  fontSize: '16px',
                  lineHeight: 1.6,
                  color: 'var(--text)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {idea.content}
                </div>

                {idea.user_id === currentUserId && (
                  <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setIsEditing(true)}
                      style={{
                        padding: '8px 16px',
                        background: 'var(--blue)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      style={{
                        padding: '8px 16px',
                        background: 'var(--red)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right panel - Likes and comments */}
          <div style={{
            width: '400px',
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Like button */}
            <div style={{
              marginBottom: '24px',
              padding: '16px',
              background: 'var(--card2)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
            }}>
              <button
                onClick={handleLike}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: isLiked ? 'var(--green)' : 'var(--card)',
                  color: isLiked ? 'white' : 'var(--text)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                <span>{isLiked ? '👍' : '👍'}</span>
                <span>{isLiked ? 'Liked' : 'Like'}</span>
                <span>({likeCount})</span>
              </button>
            </div>

            {/* Comments section */}
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 700,
                marginBottom: '16px',
                fontFamily: 'var(--font-display)',
                color: 'var(--text)',
              }}>
                Comments ({comments.length})
              </h3>

              {/* New comment input */}
              <div style={{ marginBottom: '20px' }}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '12px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'var(--font-body)',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    resize: 'vertical',
                    marginBottom: '8px',
                  }}
                />
                <button
                  onClick={handleCommentSubmit}
                  disabled={!newComment.trim() || submittingComment}
                  style={{
                    padding: '8px 16px',
                    background: (!newComment.trim() || submittingComment) ? 'var(--border)' : 'var(--green)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: (!newComment.trim() || submittingComment) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>

              {/* Comments list */}
              {loadingComments ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text2)' }}>
                  Loading comments...
                </div>
              ) : comments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)' }}>
                  No comments yet. Be the first to share your thoughts!
                </div>
              ) : (
                <div>
                  {renderComments(comments)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
