'use client'

import Link from 'next/link'
import { useState } from 'react'

const COURSES = [
  { icon: '📢', title: 'How to Market With No Money',         lessons: 9,  status: 'in-progress', progress: 35 },
  { icon: '✅', title: 'How to Validate Your Idea in 48 Hours', lessons: 7,  status: 'locked' },
  { icon: '💰', title: 'Fundraising for First-Time Founders',   lessons: 11, status: 'locked' },
  { icon: '🏗️', title: 'Building an MVP Without Engineers',     lessons: 8,  status: 'locked' },
  { icon: '🤝', title: 'How to Find a Co-Founder',              lessons: 6,  status: 'locked' },
  { icon: '📊', title: 'Pitch Deck Masterclass',                lessons: 10, status: 'locked' },
]

export default function LearnPage() {
  const [notified, setNotified] = useState(false)
  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 180px)', width: '100%' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(124,58,237,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,.06) 1px, transparent 1px)', backgroundSize: '42px 42px' }} />
      <div style={{ padding: '40px 32px', width: '100%', filter: 'blur(2px)', pointerEvents: 'none', userSelect: 'none' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--purple)', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
          📚 THE SYLLABUS
        </div>
        <h1 style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-1px', color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>
          The Founder&apos;s Roadmap
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text2)', marginBottom: '32px' }}>
          Structured courses with real exercises — not videos you forget.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
          {COURSES.map((course, i) => (
            <div key={i} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '22px',
              borderLeft: '3px solid var(--purple)',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '14px',
            }}>
              <div style={{ fontSize: '28px', flexShrink: 0 }}>{course.icon}</div>
              <div style={{ fontSize: '13px', color: 'var(--text2)' }}>Coming soon. Founder education built for execution.</div>
              <button style={{ padding: '9px 14px', borderRadius: '8px', border: 'none', background: 'var(--purple)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Notify me when this drops</button>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(247,247,246,.7)',
        backdropFilter: 'blur(2px)',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--dark2) 0%, #1a1040 100%)',
          border: '1px solid rgba(124,58,237,.25)',
          borderRadius: '20px',
          padding: '52px 56px',
          textAlign: 'center',
          maxWidth: '560px',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,.3)',
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '400px', height: '300px', background: 'radial-gradient(ellipse, rgba(124,58,237,.15) 0%, transparent 65%)', pointerEvents: 'none' }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(167,139,250,.8)', fontFamily: 'var(--font-display)', marginBottom: '10px' }}>
              COMING SOON
            </div>
            <h2 style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-1px', color: '#fff', fontFamily: 'var(--font-display)', marginBottom: '12px' }}>
              The Syllabus is<br /><em style={{ fontStyle: 'normal', color: '#a78bfa' }}>almost ready.</em>
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,.48)', lineHeight: 1.65, marginBottom: '18px' }}>
              We&apos;re building structured courses with real exercises — not videos you forget. Built for first-time founders who want to actually do the thing.
            </p>
            <button onClick={() => setNotified(true)} style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: notified ? '#22c55e' : '#a78bfa', color: notified ? '#fff' : '#0f172a', fontWeight: 700, marginBottom: '18px', cursor: 'pointer' }}>
              {notified ? '✓ Will notify you' : 'Notify me when this drops'}
            </button>

            <Link href="/home" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 28px', borderRadius: '9px',
              background: 'rgba(255,255,255,.08)',
              border: '1px solid rgba(255,255,255,.15)',
              color: 'rgba(255,255,255,.8)', textDecoration: 'none',
              fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-display)',
              transition: 'all .15s',
            }}>
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}