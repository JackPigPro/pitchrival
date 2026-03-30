'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ProfilePage() {
  const [editing, setEditing] = useState(false)
  const [messagesPublic, setMessagesPublic] = useState(true)

  return (
    <div style={{ padding: '28px 32px', width: '100%' }}>
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a2040 100%)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '18px', padding: '28px', marginBottom: '18px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>J</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '28px', margin: 0, fontFamily: 'var(--font-display)' }}>Jordan Rivera</h1>
              <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '999px', background: 'rgba(34,197,94,.2)', color: '#86efac', fontWeight: 700 }}>FOUNDER</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,.65)', marginTop: '4px' }}>Phoenix, AZ · building fintech + campus tools</div>
          </div>
          <button onClick={() => setEditing((v) => !v)} style={{ border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.08)', color: '#fff', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}>
            ✏️ Edit Profile
          </button>
        </div>
      </div>

      {editing && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', marginBottom: '14px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '10px' }}>Profile Settings</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input placeholder="Username" defaultValue="Jordan Rivera" style={{ padding: '9px 10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
            <input placeholder="Location" defaultValue="Phoenix, AZ" style={{ padding: '9px 10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
            <input placeholder="Tags" defaultValue="Fintech, Design, Product" style={{ padding: '9px 10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
            <input placeholder="Optional age" style={{ padding: '9px 10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
          </div>
          <textarea placeholder="Bio" defaultValue="Building useful tools for founders and students." rows={3} style={{ width: '100%', marginTop: '10px', padding: '9px 10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text2)' }}>Allow direct messages</span>
            <button onClick={() => setMessagesPublic((v) => !v)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: messagesPublic ? 'var(--green-tint)' : 'var(--surface)', color: messagesPublic ? 'var(--green)' : 'var(--text3)', cursor: 'pointer' }}>
              {messagesPublic ? 'Public' : 'Private'}
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Compete</div>
          <Link href="/compete/duel" style={{ display: 'block', textDecoration: 'none', color: 'var(--text2)', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>Open weekly duel →</Link>
          <Link href="/compete/leaderboard" style={{ display: 'block', textDecoration: 'none', color: 'var(--text2)', padding: '8px 0' }}>View leaderboard placement →</Link>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Connect</div>
          <Link href="/connect/feedback" style={{ display: 'block', textDecoration: 'none', color: 'var(--text2)', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>Open forum activity →</Link>
          <Link href="/connect/vault" style={{ display: 'block', textDecoration: 'none', color: 'var(--text2)', padding: '8px 0' }}>Open your vault ideas →</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'Weekly rank', value: '#47' },
          { label: 'Forum posts', value: '12' },
          { label: 'Co-founder intros', value: '9' },
          { label: 'Vault ideas', value: '6' },
        ].map((s) => (
          <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
