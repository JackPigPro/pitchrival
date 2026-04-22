'use client'

interface ComingSoonProps {
  onBack: () => void
}

export default function ComingSoon({ onBack }: ComingSoonProps) {
  return (
    <div id="coming-soon">
      <div className="coming-soon-screen">
        <div className="cs-glow"></div>
        <div className="cs-logo">B</div>
        <div className="cs-title">Coming <em>soon.</em></div>
        <p className="cs-sub">
          We&apos;re building something great. Check back soon.
        </p>
        <button className="cs-back" onClick={onBack}>← Back to home</button>
      </div>
    </div>
  )
}
