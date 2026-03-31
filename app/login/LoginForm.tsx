'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        width: '100%',
        maxWidth: '420px',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '24px',
        background: 'var(--card)',
      }}
    >
      <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>Login</h1>
      <p style={{ color: 'var(--text2)' }}>Use your email and password to sign in.</p>

      <label style={{ display: 'block', marginBottom: '6px' }}>Email</label>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        style={{ width: '100%', marginBottom: '14px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
      />

      <label style={{ display: 'block', marginBottom: '6px' }}>Password</label>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        style={{ width: '100%', marginBottom: '14px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
      />

      {error && <p style={{ color: '#ef4444', marginTop: 0 }}>{error}</p>}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          border: 'none',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #16a34a, #22c55e)',
          color: '#fff',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>

      <p style={{ marginBottom: 0, marginTop: '12px', color: 'var(--text2)' }}>
        Need an account? <Link href="/signup">Create one</Link>
      </p>
    </form>
  )
}
