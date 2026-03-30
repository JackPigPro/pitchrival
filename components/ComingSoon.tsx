'use client'

interface ComingSoonProps {
  onBack: () => void
}

export default function ComingSoon({ onBack }: ComingSoonProps) {
  return (
    <div id="coming-soon">
      <div className="coming-soon-screen">
        <div className="cs-glow"></div>
        <div className="cs-logo">P</div>
        <div className="cs-title">Coming <em>soon.</em></div>
        <p className="cs-sub">
          We&apos;re building something great. Check back soon — or drop your email and we&apos;ll tell
          you the moment we launch.
        </p>
        <button className="cs-back" onClick={onBack}>← Back to home</button>
      </div>
    </div>
  )
}
