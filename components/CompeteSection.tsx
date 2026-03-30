'use client'

import { useState, useEffect } from 'react'

interface CompeteSectionProps {
  onComingSoon: () => void
}

export default function CompeteSection({ onComingSoon }: CompeteSectionProps) {
  // Countdown timer — starts at 47s and counts down for the demo visual
  const [seconds, setSeconds] = useState(47)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 0) return 180 // reset to 3:00 when it hits 0
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const timeDisplay = `${minutes}:${secs.toString().padStart(2, '0')}`

  return (
    <div id="compete" className="feature-section fs-compete reverse">
      <div className="fs-label g">⚔️ Compete</div>

      {/* Text side */}
      <div className="feature-text">
        <div className="ft-label g">⚔️ Compete</div>
        <h2 className="ft-h2">Prove your skills.<br />Every single day.</h2>
        <p className="ft-desc">
          Get matched with someone at your exact skill level. Same prompt. Same clock.
          Judges are other users waiting for their own match — completely anonymous, zero bias.
        </p>
        <div className="ft-bullets">
          <div className="ft-b">
            <div className="ft-b-dot g"></div>
            <span>10 game modes — logo design, pitching, naming, copywriting, and more</span>
          </div>
          <div className="ft-b">
            <div className="ft-b-dot g"></div>
            <span>ELO rating system with 8 rank tiers from Trainee to Unicorn</span>
          </div>
          <div className="ft-b">
            <div className="ft-b-dot g"></div>
            <span>Daily challenges, weekly tournaments, live leaderboards</span>
          </div>
          <div className="ft-b">
            <div className="ft-b-dot g"></div>
            <span>Anonymous judging — nobody knows whose work they&apos;re rating</span>
          </div>
        </div>
        <button className="ft-cta g" onClick={onComingSoon}>⚡ Start Competing</button>
      </div>

      {/* Interactive visual side */}
      <div className="feature-visual v-g">
        <div className="match-arena">
          {/* Match header with live timer */}
          <div className="ma-header">
            <div className="ma-mode">⚔️ Logo Design</div>
            <div className="ma-timer-wrap">
              <div style={{ textAlign: 'right' }}>
                <div className="ma-timer">{timeDisplay}</div>
                <div className="ma-timer-label">remaining</div>
              </div>
            </div>
          </div>

          {/* Prompt */}
          <div className="ma-prompt-card">
            <div className="ma-prompt-label">Today&apos;s Prompt</div>
            <div className="ma-prompt-text">
              &ldquo;A luxury camping brand targeting college students who want to go off-grid.&rdquo;
            </div>
          </div>

          {/* VS row */}
          <div className="ma-vs-row">
            <div className="ma-player-card you">
              <div className="ma-player-top">
                <div className="ma-av you">J</div>
                <div>
                  <div className="ma-pname">you</div>
                  <div className="ma-pelo">ELO 1,240</div>
                </div>
              </div>
              <div className="ma-canvas">Your design canvas</div>
            </div>
            <div className="ma-vs-badge">VS</div>
            <div className="ma-player-card opp">
              <div className="ma-player-top">
                <div className="ma-av opp">?</div>
                <div>
                  <div className="ma-pname">opponent</div>
                  <div className="ma-pelo">ELO 1,218</div>
                </div>
              </div>
              <div className="ma-canvas">Opponent working…</div>
            </div>
          </div>

          {/* Submit button */}
          <button className="ma-submit">Submit Your Design →</button>

          {/* Mini leaderboard */}
          <div className="ma-lb">
            <div className="ma-lb-header">
              <div className="ma-lb-title">Weekly Leaderboard</div>
              <div className="ma-lb-live">
                <div className="live-dot"></div>&nbsp;342 live
              </div>
            </div>
            <div className="ma-lb-row">
              <div className="ma-lb-rank">🥇</div>
              <div className="ma-lb-av">D</div>
              <div className="ma-lb-name">DesignWolf</div>
              <div className="ma-lb-elo">1,891</div>
              <div className="ma-lb-delta">↑3</div>
            </div>
            <div className="ma-lb-row">
              <div className="ma-lb-rank">🥈</div>
              <div className="ma-lb-av">N</div>
              <div className="ma-lb-name">NeonBrush</div>
              <div className="ma-lb-elo">1,756</div>
              <div className="ma-lb-delta">↑1</div>
            </div>
            <div className="ma-lb-row you">
              <div className="ma-lb-rank" style={{ color: 'var(--green)', fontSize: '10px' }}>#47</div>
              <div className="ma-lb-av" style={{ background: 'var(--green-mid)' }}>J</div>
              <div className="ma-lb-name" style={{ color: 'var(--green)', fontWeight: 700 }}>you</div>
              <div className="ma-lb-elo">1,240</div>
              <div className="ma-lb-delta">↑4</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
