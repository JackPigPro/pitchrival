'use client'

import Link from 'next/link'

interface NavbarProps {
  onScrollTo: (id: string) => void
}

export default function Navbar({ onScrollTo }: NavbarProps) {
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
        <button className="nav-link" onClick={() => onScrollTo('schools')}>Schools</button>
      </div>

      <div className="nav-right">
        <Link 
          href="/login" 
          className="nav-login" 
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
        >
          Log In
        </Link>

        <Link 
          href="/signup" 
          className="nav-signup" 
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
        >
          Sign Up
        </Link>
      </div>
    </nav>
  )
}