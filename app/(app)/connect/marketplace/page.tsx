'use client'

import { useState } from 'react'

const SKILLS = ['All', 'Engineering', 'Design', 'Marketing', 'Finance', 'Operations']

const FOUNDERS = [
  {
    id: 1, avatar: 'M', color: 'var(--blue)', bg: 'var(--blue-mid)',
    name: 'Marcus T.', elo: '1,218', rank: 'Founder',
    match: 94, tagline: 'Full-stack dev looking to build in fintech or edtech.',
    skills: ['React', 'Python', 'Node.js', 'Fintech'],
    looking: 'Co-Founder', availability: 'Full-time',
  },
  {
    id: 2, avatar: 'A', color: 'var(--green)', bg: 'var(--green-mid)',
    name: 'Aisha R.', elo: '1,540', rank: 'Disruptor',
    match: 87, tagline: 'Ex-Google designer. Building consumer apps for emerging markets.',
    skills: ['Figma', 'Branding', 'UX Research', 'iOS'],
    looking: 'Technical Co-Founder', availability: 'Part-time',
  },
  {
    id: 3, avatar: 'K', color: 'var(--purple)', bg: 'var(--purple-mid)',
    name: 'Kenji S.', elo: '1,380', rank: 'Innovator',
    match: 81, tagline: 'Growth marketer. 0→1 SaaS experience. Love B2B.',
    skills: ['SEO', 'Paid Ads', 'Email', 'Analytics'],
    looking: 'Founding Team', availability: 'Full-time',
  },
  {
    id: 4, avatar: 'T', color: 'var(--gold)', bg: 'var(--gold-tint)',
    name: 'Taylor B.', elo: '1,102', rank: 'Builder',
    match: 74, tagline: 'Finance background. Building in climate tech and clean energy.',
    skills: ['Financial Modeling', 'VC', 'Operations', 'Climate'],
    looking: 'Co-Founder', availability: 'Full-time',
  },
]

export default function MarketplacePage() {
  const [activeSkill, setActiveSkill] = useState('All')

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {SKILLS.map((s) => (
          <button key={s} onClick={() => setActiveSkill(s)} style={{
            padding: '7px 16px', borderRadius: '20px',
            border: `1px solid ${activeSkill === s ? 'var(--blue)' : 'var(--border)'}`,
            background: activeSkill === s ? 'var(--blue)' : 'var(--card)',
            color: activeSkill === s ? '#fff' : 'var(--text2)',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'var(--font-display)', transition: 'all .15s',
          }}>{s}</button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text3)' }}>
          {FOUNDERS.length} founders available
        </div>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {FOUNDERS.map((f) => (
          <div key={f.id} style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '14px', padding: '22px',
            boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden',
          }}>
            {/* Match bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, var(--blue), rgba(37,99,235,.1))` }}></div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: f.color, fontFamily: 'var(--font-display)', flexShrink: 0 }}>
                  {f.avatar}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{f.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{f.rank} · ELO {f.elo}</div>
                </div>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--blue)', fontFamily: 'var(--font-display)', letterSpacing: '-1px' }}>
                {f.match}%
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.55, marginBottom: '12px' }}>
              {f.tagline}
            </p>

            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {f.skills.map(s => (
                <span key={s} style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: 'rgba(37,99,235,.08)', color: 'var(--blue)', fontFamily: 'var(--font-display)' }}>{s}</span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text3)' }}>Looking for: <strong style={{ color: 'var(--text2)' }}>{f.looking}</strong></span>
              <span style={{ fontSize: '11px', color: 'var(--text3)', marginLeft: 'auto' }}>🕐 {f.availability}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ flex: 1, padding: '9px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--blue), #3b82f6)', border: 'none', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                ✓ Connect
              </button>
              <button style={{ flex: 1, padding: '9px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text2)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
