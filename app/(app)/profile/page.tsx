'use client'

import Link from 'next/link'
import { useState } from 'react'

const matchHistory = [
  { mode: '⚔️ Logo Design',  result: 'Win',  vs: 'NeonBrush',   elo: '+18', date: '2h ago' },
  { mode: '📝 Copywriting',  result: 'Loss', vs: 'DesignWolf',  elo: '−12', date: '1d ago' },
  { mode: '💡 Pitch',        result: 'Win',  vs: 'StartupSage', elo: '+16', date: '1d ago' },
  { mode: '🏷️ Naming',       result: 'Win',  vs: 'CodeNomad',   elo: '+14', date: '2d ago' },
  { mode: '📢 Marketing',    result: 'Loss', vs: 'PitchQueen',  elo: '−10', date: '3d ago' },
]

export default function ProfilePage() {
  const [messagesPublic, setMessagesPublic] = useState(true)
  return (
    <div style={{ padding: '28px 32px', width: '100%' }}>

      {/* Public identity card */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1a2040 100%)',
        border: '1px solid rgba(255,255,255,.08)',
        borderRadius: '18px',
        padding: '36px',
        marginBottom: '28px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', gap: '28px' }}>

          {/* Avatar */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', fontWeight: 800, color: '#fff',
            fontFamily: 'var(--font-display)', flexShrink: 0,
            boxShadow: '0 4px 24px rgba(21,128,61,.4)',
          }}>J</div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', letterSpacing: '-.5px', margin: 0 }}>
                Jordan Rivera
              </h1>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(22,163,74,.15)', border: '1px solid rgba(22,163,74,.3)', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', fontWeight: 700, color: '#22c55e', fontFamily: 'var(--font-display)' }}>
                🏅 INNOVATOR
              </div>
              <button style={{ marginLeft: 'auto', border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.08)', color: '#fff', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}>✏️ Edit profile</button>
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.48)', marginBottom: '16px' }}>
              Building at the intersection of fintech &amp; edtech · Phoenix, AZ
            </p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['Pitching', 'Marketing', 'Naming', 'Logo Design', 'Copywriting'].map(s => (
                <span key={s} style={{ fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '5px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.6)', fontFamily: 'var(--font-display)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* ELO */}
          <div style={{ textAlign: 'center', background: 'rgba(22,163,74,.09)', border: '1px solid rgba(22,163,74,.22)', borderRadius: '14px', padding: '20px 28px', flexShrink: 0 }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: 'rgba(34,197,94,.7)', textTransform: 'uppercase', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>ELO</div>
            <div style={{ fontSize: '40px', fontWeight: 900, color: '#22c55e', fontFamily: 'var(--font-display)', letterSpacing: '-2px', lineHeight: 1 }}>1,240</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.3)', marginTop: '6px' }}>+18 today</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {[
          { label: 'Matches',     value: '47',  sub: 'all time' },
          { label: 'Win Rate',    value: '62%', sub: '29 wins' },
          { label: 'Global Rank', value: '#47', sub: 'this week' },
          { label: 'Ideas Posted',value: '6',   sub: '3 avg replies' },
        ].map((s) => (
          <div key={s.label} style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '20px', textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-1px', color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text2)', fontFamily: 'var(--font-display)', marginBottom: '2px' }}>{s.label}</div>
            <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>

        {/* Match history */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Match History</span>
            <span style={{ fontSize: '12px', color: 'var(--text3)' }}>Last 5</span>
          </div>
          {matchHistory.map((m, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '13px 22px',
              borderBottom: i < matchHistory.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                width: '40px', height: '20px', borderRadius: '4px',
                background: m.result === 'Win' ? 'var(--green-tint)' : '#fff1f1',
                border: `1px solid ${m.result === 'Win' ? 'rgba(22,163,74,.2)' : 'rgba(220,38,38,.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '9px', fontWeight: 800,
                color: m.result === 'Win' ? 'var(--green)' : 'var(--red)',
                fontFamily: 'var(--font-display)', flexShrink: 0,
              }}>{m.result.toUpperCase()}</div>
              <span style={{ fontSize: '13px', color: 'var(--text2)', flex: '0 0 130px' }}>{m.mode}</span>
              <span style={{ flex: 1, fontSize: '13px', color: 'var(--text2)' }}>vs. <strong style={{ color: 'var(--text)' }}>{m.vs}</strong></span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: m.result === 'Win' ? 'var(--green)' : 'var(--red)', fontFamily: 'var(--font-display)', flex: '0 0 42px', textAlign: 'right' }}>{m.elo}</span>
              <span style={{ fontSize: '11px', color: 'var(--text3)', flex: '0 0 60px', textAlign: 'right' }}>{m.date}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Link href="/connect/vault" style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '20px',
            background: 'var(--purple-tint)',
            border: '1px solid rgba(124,58,237,.2)',
            borderRadius: '14px',
            textDecoration: 'none',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform .15s',
          }}>
            <div style={{ fontSize: '28px' }}>🔐</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--purple)', fontFamily: 'var(--font-display)', marginBottom: '3px' }}>Open The Vault</div>
              <div style={{ fontSize: '12px', color: 'var(--text3)' }}>3 private ideas · 1 duel draft</div>
            </div>
            <span style={{ marginLeft: 'auto', color: 'var(--purple)', fontSize: '16px' }}>→</span>
          </Link>

          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>PUBLIC PROFILE CONTROLS</span>
            </div>
            <div style={{ padding: '13px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: 500 }}>Allow direct messages</span>
              <button onClick={() => setMessagesPublic((v) => !v)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: messagesPublic ? 'var(--green-tint)' : 'var(--surface)', color: messagesPublic ? 'var(--green)' : 'var(--text3)', cursor: 'pointer' }}>
                {messagesPublic ? 'Public' : 'Private'}
              </button>
            </div>
            <div style={{ padding: '13px 18px', borderTop: '1px solid var(--border)' }}>
              <button disabled={!messagesPublic} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: messagesPublic ? 'var(--blue)' : 'var(--surface)', color: messagesPublic ? '#fff' : 'var(--text3)', cursor: messagesPublic ? 'pointer' : 'not-allowed', fontWeight: 700 }}>
                Message this founder
              </button>
            </div>
            <div style={{ padding: '13px 18px', borderTop: '1px solid var(--border)' }}>
              <Link href="/settings" style={{ fontSize: '13px', color: 'var(--blue)', textDecoration: 'none' }}>Open full settings →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
