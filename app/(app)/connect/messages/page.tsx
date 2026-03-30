'use client'

import { useState } from 'react'

const THREADS = [
  { id: 1, avatar: 'M', color: 'var(--blue)', bg: 'var(--blue-mid)', name: 'Marcus T.', preview: 'Sounds great — I can hop on a call Thursday. Want to share your pitch deck first?', time: '2m ago', unread: 2, online: true },
  { id: 2, avatar: 'A', color: 'var(--green)', bg: 'var(--green-mid)', name: 'Aisha R.', preview: 'I redesigned the logo concept. Check it out in the shared folder 👇', time: '1h ago', unread: 0, online: true },
  { id: 3, avatar: 'P', color: 'var(--purple)', bg: 'var(--purple-mid)', name: 'Priya K.', preview: 'Did you see the new leaderboard? You\'re close to breaking top 40 🔥', time: '3h ago', unread: 0, online: false },
  { id: 4, avatar: 'K', color: 'var(--gold)', bg: 'var(--gold-tint)', name: 'Kenji S.', preview: 'The campaign idea is solid. One feedback: tighten the hook in the first 3 seconds.', time: 'Yesterday', unread: 0, online: false },
]

const MESSAGES = [
  { id: 1, self: false, text: 'Hey — saw your ParkShare idea on the feed. Really interesting angle. Is this B2C or B2B first?', time: '2:14 PM' },
  { id: 2, self: true,  text: 'B2C first! The homeowner acquisition side is actually easier than I thought. Been testing flyers in one neighborhood.', time: '2:16 PM' },
  { id: 3, self: false, text: 'Smart. Hyperlocal trust is everything. What\'s your CAC looking like?', time: '2:17 PM' },
  { id: 4, self: true,  text: 'Still figuring out unit economics tbh. That\'s actually why I posted — wanted real feedback before I go further.', time: '2:19 PM' },
  { id: 5, self: false, text: 'Sounds great — I can hop on a call Thursday. Want to share your pitch deck first?', time: '2:21 PM' },
]

export default function MessagesPage() {
  const [activeThread, setActiveThread] = useState(1)
  const [input, setInput] = useState('')
  const active = THREADS.find(t => t.id === activeThread)!

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '0', height: 'calc(100vh - 220px)', maxHeight: '640px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>

      {/* Thread list */}
      <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
          <input placeholder="Search messages…" style={{ width: '100%', padding: '8px 12px', borderRadius: '7px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '13px', color: 'var(--text)', outline: 'none', fontFamily: 'var(--font-body)' }} />
        </div>
        {THREADS.map((t) => (
          <button key={t.id} onClick={() => setActiveThread(t.id)} style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            padding: '14px 16px', border: 'none',
            background: activeThread === t.id ? 'var(--blue-tint)' : 'transparent',
            borderLeft: activeThread === t.id ? '2px solid var(--blue)' : '2px solid transparent',
            cursor: 'pointer', textAlign: 'left', transition: 'background .15s',
          }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: t.color, fontFamily: 'var(--font-display)' }}>{t.avatar}</div>
              {t.online && <div style={{ position: 'absolute', bottom: 0, right: 0, width: '9px', height: '9px', borderRadius: '50%', background: 'var(--green)', border: '2px solid var(--card)' }}></div>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{t.name}</span>
                <span style={{ fontSize: '10px', color: 'var(--text3)' }}>{t.time}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                {t.preview}
              </div>
            </div>
            {t.unread > 0 && (
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                {t.unread}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Message pane */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--card)' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: active.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: active.color, fontFamily: 'var(--font-display)' }}>{active.avatar}</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{active.name}</div>
            <div style={{ fontSize: '11px', color: active.online ? 'var(--green)' : 'var(--text3)' }}>{active.online ? '● Online' : 'Offline'}</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {MESSAGES.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.self ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '68%',
                padding: '10px 14px',
                borderRadius: msg.self ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                background: msg.self ? 'linear-gradient(135deg, var(--blue), #3b82f6)' : 'var(--surface)',
                border: msg.self ? 'none' : '1px solid var(--border)',
                fontSize: '13px', color: msg.self ? '#fff' : 'var(--text)',
                lineHeight: 1.55,
              }}>
                {msg.text}
                <div style={{ fontSize: '10px', color: msg.self ? 'rgba(255,255,255,.5)' : 'var(--text3)', marginTop: '4px', textAlign: 'right' }}>{msg.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            placeholder="Write a message…"
            style={{ flex: 1, padding: '10px 14px', borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '13px', color: 'var(--text)', outline: 'none', fontFamily: 'var(--font-body)' }}
          />
          <button style={{ padding: '10px 22px', borderRadius: '9px', background: 'linear-gradient(135deg, #16a34a, #22c55e)', border: 'none', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
