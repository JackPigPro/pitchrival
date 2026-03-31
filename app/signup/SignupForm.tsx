'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function SignupForm() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.session) {
      router.push('/dashboard')
      router.refresh()
      return
    }

    setSuccess('Check your email to verify your account, then sign in.')
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        width: '100%',
        maxWidth: '420px',
        border: '1px solid rgba(255,255,255,.14)',
        borderRadius: '16px',
        padding: '28px',
        background: 'rgba(10,14,26,.82)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 18px 45px rgba(0,0,0,.28)',
        color: '#fff',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(96,165,250,.82)', marginBottom: '10px', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
        Join PitchRival
      </div>
      <h1 style={{ margin: 0, fontSize: '34px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'var(--font-display)' }}>Create your account</h1>
      <p style={{ color: 'rgba(255,255,255,.62)', marginTop: '10px', marginBottom: '18px' }}>Sign up with your email and password to start building.</p>

      <label style={{ display: 'block', marginBottom: '7px', color: 'rgba(255,255,255,.88)', fontWeight: 600, fontSize: '14px' }}>Email</label>
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
          border: '1px solid rgba(255,255,255,.16)',
          background: 'rgba(255,255,255,.06)',
          color: '#fff',
          outline: 'none',
        }}
      />

      <label style={{ display: 'block', marginBottom: '7px', color: 'rgba(255,255,255,.88)', fontWeight: 600, fontSize: '14px' }}>Password</label>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        minLength={6}
        placeholder="At least 6 characters"
        style={{
          width: '100%',
          marginBottom: '14px',
          padding: '12px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,.16)',
          background: 'rgba(255,255,255,.06)',
          color: '#fff',
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
          background: 'linear-gradient(135deg, #16a34a, #22c55e)',
          color: '#fff',
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'var(--font-display)',
          boxShadow: '0 8px 20px rgba(21,128,61,.28)',
        }}
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>

      <p style={{ marginBottom: 0, marginTop: '14px', color: 'rgba(255,255,255,.62)' }}>
        Already have an account? <Link href="/login" style={{ color: '#60a5fa', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
      </p>
    </form>
  )
}
