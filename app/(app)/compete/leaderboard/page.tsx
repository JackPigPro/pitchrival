'use client'

import Link from 'next/link'
import { useState } from 'react'

const TIERS = [
  'Trainee — 0-499',
  'Builder — 500-750',
  'Creator — 750-999',
  'Founder — 1000 to 1249',
  'Visionary — 1250 to 1499',
  'Icon — 1500 to 1749',
  'Titan — 1750 to 1999',
  'Unicorn — 2000+',
]

const LEADERS = [
  { rank: 1, name: 'DesignWolf', elo: 1891 },
  { rank: 2, name: 'NeonBrush', elo: 1756 },
  { rank: 3, name: 'StartupSage', elo: 1698 },
  { rank: 4, name: 'CodeNomad', elo: 1540 },
  { rank: 5, name: 'PitchQueen', elo: 1489 },
  { rank: 6, name: 'FounderFuel', elo: 1420 },
  { rank: 7, name: 'BrandBlitz', elo: 1398 },
  { rank: 8, name: 'IdeaForge', elo: 1361 },
  { rank: 9, name: 'GridPulse', elo: 1320 },
  { rank: 10, name: 'VentureNerd', elo: 1288 },
]

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'all-time'>('weekly')
  return (
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {(['daily', 'weekly', 'all-time'] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: period === p ? 'var(--text)' : 'var(--card)', color: period === p ? '#fff' : 'var(--text2)', fontWeight: 700, cursor: 'pointer' }}>
              {p}
            </button>
          ))}
        </div>
  
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '24px' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 120px', gap: '0', padding: '10px 22px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
              {['#', 'Founder', 'ELO'].map((h) => (
                <div key={h} style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text3)', fontFamily: 'var(--font-display)' }}>{h}</div>
              ))}
            </div>
            {LEADERS.map((row, i) => {
              return (
                <div key={row.rank} style={{
                    display: 'grid', gridTemplateColumns: '48px 1fr 120px',
                    alignItems: 'center', gap: '0',
                    padding: '13px 22px',
                    borderBottom: i < LEADERS.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ fontSize: i < 3 ? '18px' : '13px', fontWeight: 700, color: 'var(--text3)', fontFamily: 'var(--font-display)' }}>
                      {row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : `#${row.rank}`}
                    </div>
                    <Link href="/profile" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', textDecoration: 'none' }}>{row.name}</Link>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{row.elo.toLocaleString()}</div>
                </div>
              )
            })}
            <div style={{ padding: '10px 22px', borderTop: '1px solid var(--border)', background: 'var(--green-tint)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--green)', fontWeight: 700 }}>#47 You</span>
              <span style={{ color: 'var(--green)', fontWeight: 700 }}>1,240</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>YOUR STANDING</span>
              </div>
              <div style={{ padding: '20px 18px' }}>
                <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--green)', fontFamily: 'var(--font-display)' }}>#47</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '10px' }}>Founder tier · 1,240 ELO</div>
                <Link href="/compete/duel" style={{
                  display: 'block', textAlign: 'center', padding: '11px',
                  background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                  borderRadius: '9px', color: '#fff',
                  fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-display)',
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(21,128,61,.3)',
                }}>
                  ⚔️ Enter This Week&apos;s Duel
                </Link>
              </div>
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '8px', fontFamily: 'var(--font-display)' }}>Rank Tiers</div>
              {TIERS.map((tier) => <div key={tier} style={{ fontSize: '12px', color: 'var(--text2)', padding: '4px 0' }}>{tier}</div>)}
            </div>
          </div>
        </div>
      </div>
    )
  }