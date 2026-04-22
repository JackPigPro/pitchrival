'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function ForgotPasswordComponent() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) {
        setError(resetError.message)
        return
      }

      setSuccess('Password reset link sent! Check your email for instructions.')
    } catch (unexpectedError) {
      console.error('Unexpected error during password reset:', unexpectedError)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <label style={{ display: 'block', marginBottom: '7px', color: 'var(--text)', fontWeight: 600, fontSize: '14px' }}>
        Email
      </label>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        placeholder="you@example.com"
        style={{
          width: '100%',
          marginBottom: '14px',
          padding: '12px',
          borderRadius: '10px',
          border: '1px solid var(--border2)',
          background: 'var(--surface)',
          color: 'var(--text)',
          outline: 'none',
        }}
      />

      {error && <p style={{ color: '#fca5a5', marginTop: 0, marginBottom: '10px', fontSize: '14px' }}>{error}</p>}
      {success && (
        <p
          style={{
            color: '#86efac',
            marginTop: 0,
            marginBottom: '10px',
            fontSize: '14px',
            background: 'rgba(22,163,74,.15)',
            border: '1px solid rgba(22,163,74,.35)',
            borderRadius: '10px',
            padding: '10px 12px',
          }}
        >
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          border: 'none',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
          color: '#fff',
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'var(--font-display)',
          boxShadow: '0 8px 20px rgba(59,130,246,.28)',
        }}
      >
        {loading ? 'Sending reset link...' : 'Send Reset Link'}
      </button>
    </form>
  )
}
