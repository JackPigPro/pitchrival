'use client'

import { useState } from 'react'
import { useAppState } from '../../../../components/AppStateProvider'

type Topic = 'general' | 'question' | 'idea' | 'feedback'
type SortKey = 'recent' | 'liked' | 'viewed'

const POSTS = [
  { id: 1, name: 'Sarah K.', topic: 'feedback', title: 'ParkShare onboarding flow', text: 'Need blunt feedback on first-time user onboarding. Where does this break trust?', likes: 24, comments: 7, views: 130 },
  { id: 2, name: 'Priya K.', topic: 'idea', title: 'Campus gig marketplace', text: 'Would you use this as a student? Looking for edge-case concerns.', likes: 15, comments: 4, views: 80 },
  { id: 3, name: 'Marcus T.', topic: 'question', title: 'How to validate in 72 hours?', text: 'What is the fastest real validation loop with no ad spend?', likes: 42, comments: 19, views: 300 },
]

export default function ForumPage() {
  const { forumDraft, setForumDraft } = useAppState()
  const [topic, setTopic] = useState<Topic>('general')
  const [sort, setSort] = useState<SortKey>('recent')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState(forumDraft)
  const [posts, setPosts] = useState(POSTS)
  const [openId, setOpenId] = useState<number | null>(null)

  const visiblePosts = posts
    .filter((p) => topic === 'general' ? true : p.topic === topic)
    .sort((a, b) => sort === 'recent' ? b.id - a.id : sort === 'liked' ? b.likes - a.likes : b.views - a.views)

  const selected = visiblePosts.find((p) => p.id === openId) ?? null

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '.95fr 1.05fr', gap: '16px' }}>
        <div style={{ background: 'linear-gradient(135deg, #e8f0fe 0%, #dbeafe 100%)', border: '1px solid rgba(37,99,235,.18)', borderRadius: '12px', padding: '16px', alignSelf: 'start', position: 'sticky', top: '20px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '8px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Create Forum Post</div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            {(['question', 'idea', 'feedback'] as const).map((t) => (
              <button key={t} onClick={() => setTopic(t)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: topic === t ? 'var(--text)' : 'var(--surface)', color: topic === t ? '#fff' : 'var(--text2)', fontWeight: 700, cursor: 'pointer' }}>{t}</button>
            ))}
          </div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Topic title" style={{ width: '100%', marginBottom: '8px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
          <textarea value={body} onChange={(e) => { setBody(e.target.value); setForumDraft(e.target.value) }} placeholder="Write your post details..." rows={8} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', resize: 'vertical' }} />
          <button
            onClick={() => {
              if (!title.trim() || !body.trim()) return
              setPosts((prev) => [{ id: Date.now(), name: 'Jordan Rivera', topic: topic === 'general' ? 'feedback' : topic, title, text: body, likes: 0, comments: 0, views: 0 }, ...prev])
              setTitle('')
              setBody('')
              setForumDraft('')
              setOpenId(null)
            }}
            style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '8px', border: 'none', background: 'var(--blue)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
          >
            Post to Forum
          </button>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['general', 'question', 'idea', 'feedback'] as const).map((t) => (
                <button key={t} onClick={() => { setTopic(t); setOpenId(null) }} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: topic === t ? 'var(--text)' : 'var(--surface)', color: topic === t ? '#fff' : 'var(--text2)', fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize' }}>{t}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['recent', 'liked', 'viewed'] as const).map((s) => (
                <button key={s} onClick={() => setSort(s)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: sort === s ? 'var(--blue)' : 'var(--surface)', color: sort === s ? '#fff' : 'var(--text2)', fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize' }}>{s}</button>
              ))}
            </div>
          </div>

          {!selected && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {visiblePosts.map((post) => (
                <button key={post.id} onClick={() => setOpenId(post.id)} style={{ textAlign: 'left', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>{post.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase' }}>{post.topic}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '8px' }}>{post.text.slice(0, 95)}...</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>👍 {post.likes} · 💬 {post.comments} · 👀 {post.views}</div>
                </button>
              ))}
            </div>
          )}

          {selected && (
            <div style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '12px' }}>
              <button onClick={() => setOpenId(null)} style={{ border: 'none', background: 'transparent', color: 'var(--blue)', cursor: 'pointer', marginBottom: '8px' }}>← Back to forum</button>
              <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>{selected.title}</div>
              <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '10px' }}>{selected.text}</div>
              <button onClick={() => setPosts((prev) => prev.map((p) => p.id === selected.id ? { ...p, likes: p.likes + 1 } : p))} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', marginBottom: '10px' }}>
                👍 Like ({selected.likes})
              </button>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', fontSize: '12px', color: 'var(--text2)' }}>
                <div style={{ marginBottom: '6px' }}><strong>Marcus:</strong> Start with one neighborhood and one pricing model.</div>
                <div style={{ marginBottom: '8px' }}><strong>Aisha:</strong> Onboarding copy needs simpler language.</div>
                <input placeholder="Write a comment..." style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
