'use client'

import { useState } from 'react'

interface CreateIdeaFormProps {
  onSubmit: (ideaData: { title: string; content: string; is_public: boolean }) => Promise<void>
}

export default function CreateIdeaForm({ onSubmit }: CreateIdeaFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required')
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        is_public: isPublic,
      })

      // Reset form
      setTitle('')
      setContent('')
      setIsPublic(true)
    } catch (err) {
      console.error('Error submitting idea:', err)
      setError('Failed to create idea. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '24px',
      height: 'fit-content',
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: 700,
        marginBottom: '16px',
        fontFamily: 'var(--font-display)',
        color: 'var(--text)',
      }}>
        Share Your Idea
      </h3>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <input
            type="text"
            placeholder="Give your idea a catchy title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'var(--font-body)',
              background: 'var(--bg)',
              color: 'var(--text)',
            }}
            maxLength={200}
          />
        </div>

        <div>
          <textarea
            placeholder="Describe your idea in detail..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px 16px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'var(--font-body)',
              background: 'var(--bg)',
              color: 'var(--text)',
              resize: 'vertical',
            }}
            maxLength={2000}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              style={{ margin: 0 }}
            />
            <span style={{ fontSize: '14px', color: 'var(--text2)' }}>
              Public (everyone can see)
            </span>
          </label>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            background: 'var(--red)',
            color: 'white',
            borderRadius: '6px',
            fontSize: '13px',
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !title.trim() || !content.trim()}
          style={{
            padding: '12px 24px',
            background: submitting ? 'var(--border)' : 'var(--green)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: submitting ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-body)',
            transition: 'background-color 0.2s',
          }}
        >
          {submitting ? 'Posting...' : 'Post Idea'}
        </button>
      </form>

      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: 'var(--card2)',
        borderRadius: '6px',
        fontSize: '12px',
        color: 'var(--text3)',
        lineHeight: 1.5,
      }}>
        <strong>Tips:</strong> Be specific about the problem you're solving and who your target audience is. The more detail you provide, the better feedback you'll receive.
      </div>
    </div>
  )
}
