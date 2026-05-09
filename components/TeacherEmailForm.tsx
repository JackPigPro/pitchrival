'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function TeacherEmailForm() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // Check if email already exists
      const { data: existingEmail } = await supabase
        .from('teacher_emails')
        .select('email')
        .eq('email', email)
        .single()

      if (existingEmail) {
        setError('This email is already registered for updates.')
        setIsSubmitting(false)
        return
      }

      // Insert new email
      const { error: insertError } = await supabase
        .from('teacher_emails')
        .insert({
          email: email.toLowerCase().trim(),
          created_at: new Date().toISOString(),
          status: 'pending'
        })

      if (insertError) {
        throw insertError
      }

      setIsSubmitted(true)
      setEmail('')
    } catch (err) {
      console.error('Error submitting email:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="teacher-form-success" style={{
        background: 'var(--green)',
        color: 'white',
        padding: '24px',
        borderRadius: '12px',
        textAlign: 'center',
        border: '2px solid var(--green)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✉️</div>
        <h4 style={{
          fontSize: '20px',
          fontWeight: 800,
          fontFamily: 'var(--font-display)',
          margin: '0 0 8px'
        }}>
          You're on the list!
        </h4>
        <p style={{
          fontSize: '16px',
          margin: 0,
          opacity: 0.9
        }}>
          We'll email you when Learn launches in September.
        </p>
      </div>
    )
  }

  return (
    <div className="teacher-email-form" style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: 'var(--shadow)'
    }}>
      <div className="form-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎓</div>
        <h4 style={{
          fontSize: '20px',
          fontWeight: 800,
          fontFamily: 'var(--font-display)',
          color: 'var(--text)',
          margin: '0 0 8px'
        }}>
          Get Notified for Launch
        </h4>
        <p style={{
          fontSize: '14px',
          color: 'var(--text2)',
          margin: 0,
          lineHeight: 1.5
        }}>
          Be the first to know when Learn goes live in September
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your school email"
            required
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontSize: '16px',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--gold)'
              e.target.style.outline = 'none'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)'
            }}
          />
        </div>

        {error && (
          <div style={{
            color: 'var(--red)',
            fontSize: '14px',
            textAlign: 'center',
            padding: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !email}
          style={{
            padding: '16px 24px',
            borderRadius: '8px',
            border: 'none',
            background: isSubmitting || !email ? 'var(--border)' : 'var(--gold)',
            color: isSubmitting || !email ? 'var(--text3)' : 'white',
            fontSize: '16px',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            cursor: isSubmitting || !email ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: isSubmitting ? 0.7 : 1
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Notify Me at Launch'}
        </button>
      </form>

      <div style={{
        fontSize: '12px',
        color: 'var(--text3)',
        textAlign: 'center',
        marginTop: '16px'
      }}>
        We respect your privacy. Unsubscribe at any time.
      </div>
    </div>
  )
}
