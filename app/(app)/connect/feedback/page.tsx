'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAppState } from '../../../../components/AppStateProvider'

const POSTS = [
  {
    id: 1,
    name: 'Sarah K.',
    topic: 'feedback',
    title: 'ParkShare onboarding flow',
    text: 'Need blunt feedback on first-time user onboarding. Where does this break trust?',
    likes: 24,
    comments: 7,
  },
  {
    id: 2,
    name: 'Priya K.',
    topic: 'idea',
    title: 'Campus gig marketplace',
    text: 'Would you use this as a student? Looking for edge-case concerns.',
    likes: 15,
    comments: 4,
  },
]

export default function FeedbackPage() {
  const { forumDraft, setForumDraft } = useAppState()
  const [topic, setTopic] = useState<'question' | 'idea' | 'feedback'>('question')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState(forumDraft)
  const [openId, setOpenId] = useState<number | null>(null)
  const [posts, setPosts] = useState(POSTS)

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={{ background: 'linear-gradient(135deg, #e8f0fe 0%, #dbeafe 100%)', border: '1px solid rgba(37,99,235,.18)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '8px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>HIGH-SPEED FORUM</div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            {(['question', 'idea', 'feedback'] as const).map((t) => (
              <button key={t} onClick={() => setTopic(t)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: topic === t ? 'var(--text)' : 'var(--surface)', color: topic === t ? '#fff' : 'var(--text2)', fontWeight: 700, cursor: 'pointer' }}>{t}</button>
            ))}
          </div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Topic title" style={{ width: '100%', marginBottom: '8px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
          <textarea value={body} onChange={(e) => { setBody(e.target.value); setForumDraft(e.target.value) }} placeholder="Write your post details..." rows={5} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', resize: 'vertical' }} />
          <button onClick={() => {
            if (!title.trim() || !body.trim()) return
            setPosts((prev) => [{ id: Date.now(), name: 'Jordan Rivera', topic, title, text: body, likes: 0, comments: 0 }, ...prev])
            setTitle('')
            setBody('')
            setForumDraft('')
          }} style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '8px', border: 'none', background: 'var(--blue)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
            Post
          </button>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontWeight: 700, marginBottom: '8px', fontFamily: 'var(--font-display)' }}>LIVE BOARD SNAPSHOT</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: '8px', padding: '10px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)' }}>NEW TODAY</div>
              <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--blue)' }}>18</div>
            </div>
            <div style={{ border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: '8px', padding: '10px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)' }}>AVG RESPONSE</div>
              <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--blue)' }}>9m</div>
            </div>
          </div>
          <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
            <Link href="/connect/messages" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', color: 'var(--text2)', padding: '8px', border: '1px solid var(--border)', borderRadius: '8px' }}>Messages</Link>
            <Link href="/connect/vault" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', color: 'var(--text2)', padding: '8px', border: '1px solid var(--border)', borderRadius: '8px' }}>Vault</Link>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {posts.map((post) => (
          <div key={post.id} style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '14px', padding: '22px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--blue-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: 'var(--blue)', fontFamily: 'var(--font-display)', flexShrink: 0 }}>
                {post.name[0]}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{post.name}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text3)' }}>{post.topic}</div>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: '6px', letterSpacing: '-.2px' }}>
              {post.title}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '14px' }}>
              {openId === post.id ? post.text : `${post.text.slice(0, 110)}...`}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                👍 {post.likes}
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(37,99,235,.2)', background: 'var(--blue-tint)', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--blue)', fontFamily: 'var(--font-body)' }}>
                💬 {post.comments} comments
              </button>
              <button onClick={() => setOpenId(openId === post.id ? null : post.id)} style={{ marginLeft: 'auto', fontSize: '12px', background: 'transparent', border: 'none', color: 'var(--blue)', cursor: 'pointer' }}>
                {openId === post.id ? 'Back to forum' : 'Open thread'}
              </button>
            </div>
            {openId === post.id && (
              <div style={{ marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px' }}>Comments</div>
                <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '10px' }}>Strong idea. Focus your first launch on one neighborhood only.</div>
                <input placeholder="Write a comment..." style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
