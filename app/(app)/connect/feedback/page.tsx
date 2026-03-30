'use client'

import { useState } from 'react'

const IDEAS = [
  {
    id: 1, avatar: 'S', avatarColor: 'var(--blue-mid)', avatarText: 'var(--blue)',
    name: 'Sarah K.', elo: 'Innovator · ELO 1,340',
    badge: '🔍 Seeking Feedback', badgeStyle: { background: 'var(--blue-tint)', color: 'var(--blue)', border: '1px solid rgba(37,99,235,.2)' },
    title: 'ParkShare — Airbnb for empty driveways',
    text: 'Homeowners rent their spots during peak hours. Testing in Phoenix first. Anyone validated a hyperlocal marketplace before?',
    upvotes: 24, replies: 7, cofounders: 2, time: '2h ago',
  },
  {
    id: 2, avatar: 'M', avatarColor: 'var(--green-mid)', avatarText: 'var(--green)',
    name: 'Marcus T.', elo: 'Founder · ELO 1,218',
    badge: '🤝 Looking for Co-Founder', badgeStyle: { background: 'var(--green-tint)', color: 'var(--green)', border: '1px solid rgba(22,163,74,.2)' },
    title: 'AI tutoring for community college students',
    text: 'GPT-powered study assistant that adapts to your community college textbooks. Need a technical co-founder who\'s worked in edtech.',
    upvotes: 38, replies: 12, cofounders: 5, time: '5h ago',
  },
  {
    id: 3, avatar: 'P', avatarColor: 'var(--purple-mid)', avatarText: 'var(--purple)',
    name: 'Priya K.', elo: 'Visionary · ELO 1,456',
    badge: '🔍 Seeking Feedback', badgeStyle: { background: 'var(--blue-tint)', color: 'var(--blue)', border: '1px solid rgba(37,99,235,.2)' },
    title: 'Campus gig economy — students helping students',
    text: 'A Fiverr-like platform where college students offer micro-services to each other. Moving, tutoring, errands. Tested at ASU with 80 users.',
    upvotes: 61, replies: 19, cofounders: 3, time: '1d ago',
  },
]

export default function FeedbackPage() {
  const [filter, setFilter] = useState<'all' | 'feedback' | 'cofounder'>('all')

  const filtered = IDEAS.filter(i => {
    if (filter === 'feedback') return i.badge.includes('Feedback')
    if (filter === 'cofounder') return i.badge.includes('Co-Founder')
    return true
  })

  return (
    <div style={{ maxWidth: '820px' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['all', 'feedback', 'cofounder'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 16px', borderRadius: '7px',
              border: '1px solid var(--border)',
              background: filter === f ? 'var(--text)' : 'var(--card)',
              color: filter === f ? '#fff' : 'var(--text2)',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              transition: 'all .15s',
            }}>
              {f === 'all' ? 'All Ideas' : f === 'feedback' ? '🔍 Seeking Feedback' : '🤝 Co-Founder Wanted'}
            </button>
          ))}
        </div>
        <button style={{
          padding: '9px 22px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #16a34a, #22c55e)',
          border: 'none', color: '#fff',
          fontSize: '13px', fontWeight: 700, cursor: 'pointer',
          fontFamily: 'var(--font-display)',
          boxShadow: '0 2px 10px rgba(21,128,61,.3)',
        }}>
          + Post Your Idea
        </button>
      </div>

      {/* Idea cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map((idea) => (
          <div key={idea.id} style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '14px', padding: '22px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'box-shadow .2s, transform .2s',
            cursor: 'pointer',
          }}>
            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: idea.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: idea.avatarText, fontFamily: 'var(--font-display)', flexShrink: 0 }}>
                {idea.avatar}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{idea.name}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text3)', background: 'var(--surface)', padding: '2px 8px', borderRadius: '4px' }}>{idea.elo}</div>
            </div>

            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '5px', marginBottom: '10px', fontFamily: 'var(--font-display)', ...idea.badgeStyle }}>
              {idea.badge}
            </div>

            {/* Content */}
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: '6px', letterSpacing: '-.2px' }}>
              {idea.title}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '14px' }}>
              {idea.text}
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                👍 {idea.upvotes}
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(37,99,235,.2)', background: 'var(--blue-tint)', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--blue)', fontFamily: 'var(--font-body)' }}>
                💬 {idea.replies} replies
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(37,99,235,.2)', background: 'var(--blue-tint)', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--blue)', fontFamily: 'var(--font-body)' }}>
                🤝 Co-found
              </button>
              <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text3)' }}>{idea.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
