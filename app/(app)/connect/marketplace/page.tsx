'use client'

import { useState } from 'react'
import Link from 'next/link'

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
  const [search, setSearch] = useState('')
  const filteredFounders = FOUNDERS.filter((f) =>
    (activeSkill === 'All' || f.skills.includes(activeSkill)) &&
    `${f.name} ${f.skills.join(' ')} ${f.looking}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={{ background: 'linear-gradient(135deg, #e8f0fe 0%, #dbeafe 100%)', border: '1px solid rgba(37,99,235,.18)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '8px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>POST YOUR FOUNDER CARD</div>
          <input placeholder="Your role (Dev, Design, Sales...)" style={{ width: '100%', marginBottom: '8px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
          <input placeholder="Location" style={{ width: '100%', marginBottom: '8px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
          <input placeholder="Skill tags (3-5)" style={{ width: '100%', marginBottom: '8px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
          <textarea placeholder="One-line pitch and what you need" rows={3} style={{ width: '100%', marginBottom: '8px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', resize: 'vertical' }} />
          <button style={{ padding: '10px 14px', borderRadius: '8px', border: 'none', background: 'var(--blue)', color: '#fff', fontWeight: 700 }}>Publish profile</button>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontWeight: 700, marginBottom: '8px', fontFamily: 'var(--font-display)' }}>Search + filter</div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by role, skill, or location..." style={{ width: '100%', marginBottom: '10px', padding: '9px 10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
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
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text3)' }}>
            {filteredFounders.length} founders available
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', maxHeight: '58vh', overflowY: 'auto', paddingRight: '4px' }}>
        {filteredFounders.map((f) => (
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
                Quick Message
              </button>
              <Link href="/profile" style={{ flex: 1, padding: '9px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text2)', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-display)', textDecoration: 'none', textAlign: 'center' }}>
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
