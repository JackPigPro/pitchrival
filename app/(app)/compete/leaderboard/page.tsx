'use client'

import Link from 'next/link'
import { useState } from 'react'

const TIERS = [
  { label: 'TRAINEE', range: '0-499', color: '#94a3b8' },
  { label: 'BUILDER', range: '500-750', color: '#64748b' },
  { label: 'CREATOR', range: '750-999', color: '#3b82f6' },
  { label: 'FOUNDER', range: '1000-1249', color: '#16a34a' },
  { label: 'VISIONARY', range: '1250-1499', color: '#8b5cf6' },
  { label: 'ICON', range: '1500-1749', color: '#f59e0b' },
  { label: 'TITAN', range: '1750-1999', color: '#ef4444' },
  { label: 'UNICORN', range: '2000+', color: '#ec4899' },
] as const

const LEADERBOARDS = {
  daily: [
    { rank: 1, name: 'QuickPitch', elo: 1564 }, { rank: 2, name: 'NeonBrush', elo: 1542 }, { rank: 3, name: 'LogoPilot', elo: 1529 },
    { rank: 4, name: 'FoundrFox', elo: 1498 }, { rank: 5, name: 'DeckNinja', elo: 1477 }, { rank: 6, name: 'SprintWave', elo: 1440 },
    { rank: 7, name: 'PitchQueen', elo: 1416 }, { rank: 8, name: 'CodeNomad', elo: 1398 }, { rank: 9, name: 'IdeaForge', elo: 1360 }, { rank: 10, name: 'JordanRivera', elo: 1335 },
  ],
  weekly: [
    { rank: 1, name: 'DesignWolf', elo: 1891 }, { rank: 2, name: 'NeonBrush', elo: 1756 }, { rank: 3, name: 'StartupSage', elo: 1698 },
    { rank: 4, name: 'CodeNomad', elo: 1540 }, { rank: 5, name: 'PitchQueen', elo: 1489 }, { rank: 6, name: 'FounderFuel', elo: 1420 },
    { rank: 7, name: 'BrandBlitz', elo: 1398 }, { rank: 8, name: 'IdeaForge', elo: 1361 }, { rank: 9, name: 'GridPulse', elo: 1320 }, { rank: 10, name: 'VentureNerd', elo: 1288 },
  ],
  'all-time': [
    { rank: 1, name: 'UnicornAce', elo: 2212 }, { rank: 2, name: 'DesignWolf', elo: 2077 }, { rank: 3, name: 'NeonBrush', elo: 2019 },
    { rank: 4, name: 'TitanPitch', elo: 1966 }, { rank: 5, name: 'VisionFlow', elo: 1884 }, { rank: 6, name: 'FounderFuel', elo: 1762 },
    { rank: 7, name: 'PitchQueen', elo: 1710 }, { rank: 8, name: 'CodeNomad', elo: 1638 }, { rank: 9, name: 'StartupSage', elo: 1599 }, { rank: 10, name: 'BrandBlitz', elo: 1532 },
  ],
} as const

function getTier(elo: number) {
  if (elo >= 2000) return TIERS[7]
  if (elo >= 1750) return TIERS[6]
  if (elo >= 1500) return TIERS[5]
  if (elo >= 1250) return TIERS[4]
  if (elo >= 1000) return TIERS[3]
  if (elo >= 750) return TIERS[2]
  if (elo >= 500) return TIERS[1]
  return TIERS[0]
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'all-time'>('weekly')
  const leaders = LEADERBOARDS[period]
  const yourStat = period === 'daily' ? { rank: 10, elo: 1335, delta: '+6 today' } : period === 'weekly' ? { rank: 47, elo: 1240, delta: '↑4 this week' } : { rank: 128, elo: 1188, delta: 'steady' }
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
            <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 120px 140px', gap: '0', padding: '10px 22px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
              {['#', 'FOUNDER', 'ELO', 'TIER'].map((h) => (
                <div key={h} style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text3)', fontFamily: 'var(--font-display)' }}>{h}</div>
              ))}
            </div>
            {leaders.map((row, i) => {
              const tier = getTier(row.elo)
              return (
                <div key={row.rank} style={{
                    display: 'grid', gridTemplateColumns: '48px 1fr 120px 140px',
                    alignItems: 'center', gap: '0',
                    padding: '13px 22px',
                    borderBottom: i < leaders.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ fontSize: i < 3 ? '18px' : '13px', fontWeight: 700, color: 'var(--text3)', fontFamily: 'var(--font-display)' }}>
                      {row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : `#${row.rank}`}
                    </div>
                    <Link href="/profile" style={{ fontSize: '13px', fontWeight: 600, color: tier.color, textDecoration: 'none' }}>{row.name}</Link>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{row.elo.toLocaleString()}</div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: tier.color, fontFamily: 'var(--font-display)' }}>{tier.label}</div>
                </div>
              )
            })}
            <div style={{ padding: '10px 22px', borderTop: '1px solid var(--border)', background: 'var(--green-tint)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--green)', fontWeight: 700 }}>#{yourStat.rank} YOU</span>
              <span style={{ color: 'var(--green)', fontWeight: 700 }}>{yourStat.elo.toLocaleString()}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>YOUR STANDING</span>
              </div>
              <div style={{ padding: '20px 18px' }}>
                <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--green)', fontFamily: 'var(--font-display)' }}>#{yourStat.rank}</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '10px' }}>FOUNDER TIER · {yourStat.elo.toLocaleString()} ELO · {yourStat.delta}</div>
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
              <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '8px', fontFamily: 'var(--font-display)' }}>RANK TIERS</div>
              {TIERS.map((tier) => (
                <div key={tier.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0' }}>
                  <span style={{ color: tier.color, fontWeight: 700 }}>{tier.label}</span>
                  <span style={{ color: 'var(--text3)' }}>{tier.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }