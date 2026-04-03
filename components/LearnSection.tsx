'use client'

import { useState } from 'react'
import Link from 'next/link'

interface LearnSectionProps {
  onComingSoon: () => void
}

const LESSONS = [
  { id: 1, status: 'done', name: "Why paid ads don't work first", sub: 'Lesson 1 · Completed', time: '18 min' },
  { id: 2, status: 'done', name: 'The 100 users playbook', sub: 'Lesson 2 · Completed', time: '24 min' },
  { id: 3, status: 'active', name: 'Content that actually gets shared', sub: 'Lesson 3 · In progress', time: '22 min' },
  { id: 4, status: 'lock', name: 'Community-led growth', sub: 'Lesson 4', time: '31 min' },
] as const

type LessonStatus = 'done' | 'active' | 'lock'

const checkIcon: Record<LessonStatus, string> = {
  done: '✓',
  active: '▶',
  lock: '🔒',
}

export default function LearnSection({ onComingSoon }: LearnSectionProps) {
  const [activeLesson, setActiveLesson] = useState(3)

  return (
    <div id="learn" className="feature-section fs-learn">
      <div className="fs-label p">📚 Learn</div>
      {/* Text side */}
      <div className="feature-text">
        <div className="ft-label p">📚 Learn</div>
        <h2 className="ft-h2">
          Learn how to<br />actually build.
        </h2>
        <p className="ft-desc">
          Structured startup courses built for first-time founders. Coming soon.
        </p>
        <div className="ft-bullets">
          <div className="ft-b">
            <div className="ft-b-dot p"></div>
            <span>6 free courses covering marketing, fundraising, validation, and more</span>
          </div>
          <div className="ft-b">
            <div className="ft-b-dot p"></div>
            <span>Real exercises — not just videos you forget. Actually do the thing.</span>
          </div>
          <div className="ft-b">
            <div className="ft-b-dot p"></div>
            <span>Practice mode — apply what you learn directly in competition</span>
          </div>
          <div className="ft-b">
            <div className="ft-b-dot p"></div>
            <span>School mode — teachers can assign challenges and track progress</span>
          </div>
        </div>
        <Link href="/login?mode=signup" className="ft-cta p" style={{ textDecoration: 'none' }}>📚 Start Learning Free</Link>
      </div>

      {/* Interactive visual side */}
      <div className="feature-visual v-p">
        <div className="learn-player">
          {/* Course header card */}
          <div className="lp-course-card">
            <div className="lp-course-meta">📚 Current Course</div>
            <div className="lp-course-title">How to Market With No Money</div>
            <div className="lp-prog-row">
              <div className="lp-bar"><div className="lp-fill"></div></div>
              <div className="lp-pct">35%</div>
            </div>
            <div className="lp-stats">
              <div className="lp-stat"><strong>3</strong> of 9 lessons done</div>
              <div className="lp-stat"><strong>22 min</strong> left in lesson</div>
              <div className="lp-stat"><strong>Free</strong> forever</div>
            </div>
          </div>

          {/* Lesson list */}
          <div className="lp-lessons-card">
            <div className="lp-lessons-header">
              <div className="lp-lessons-title">Lessons</div>
              <div className="lp-lessons-count">9 total · 6 free</div>
            </div>
            {LESSONS.map((lesson) => (
              <div
                key={lesson.id}
                className={`lp-lesson ${activeLesson === lesson.id ? 'active-l' : ''}`}
                onClick={() => lesson.status !== 'lock' && setActiveLesson(lesson.id)}
              >
                <div className={`lp-check ${lesson.status}`}>
                  {checkIcon[lesson.status]}
                </div>
                <div className="lp-lesson-info">
                  <div className="lp-lesson-name">{lesson.name}</div>
                  <div className="lp-lesson-sub">{lesson.sub}</div>
                </div>
                <div className="lp-lesson-time">{lesson.time}</div>
              </div>
            ))}
          </div>

          {/* Continue button */}
          <button className="lp-continue" onClick={onComingSoon}>
            ▶ Continue Lesson 3 &nbsp;·&nbsp; 22 min left
          </button>
        </div>
      </div>
    </div>
  )
}
