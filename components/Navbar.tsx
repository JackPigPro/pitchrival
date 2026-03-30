'use client'

interface NavbarProps {
  onComingSoon: () => void
  onScrollTo: (id: string) => void
}

export default function Navbar({ onComingSoon, onScrollTo }: NavbarProps) {
  return (
    <nav className="nav">
      <a className="nav-brand" href="#top">
        <div className="nav-logo">P</div>
        <span className="nav-name">PitchRival</span>
      </a>

      <div className="nav-links">
        <button className="nav-link" onClick={() => onScrollTo('connect')}>Connect</button>
        <button className="nav-link" onClick={() => onScrollTo('compete')}>Compete</button>
        <button className="nav-link" onClick={() => onScrollTo('learn')}>Learn</button>
        <button className="nav-link" onClick={() => onScrollTo('pricing')}>Pricing</button>
        <button className="nav-link" onClick={() => onScrollTo('schools')}>Schools</button>
      </div>

      <div className="nav-right">
        <button className="nav-login" onClick={onComingSoon}>Log In</button>
        <button className="nav-signup" onClick={onComingSoon}>Sign Up</button>
      </div>
    </nav>
  )
}
