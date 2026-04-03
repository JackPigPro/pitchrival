import type { Metadata } from 'next'
import Link from 'next/link'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Privacy Policy — PitchRival',
  description: 'Privacy Policy for PitchRival.',
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Privacy Policy — PitchRival</title>
        <meta name="description" content="Privacy Policy for PitchRival." />
      </head>
      <body>
        <style>{`
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            background: var(--bg, #ffffff);
            color: var(--text, #000000);
          }
          .legal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 40px;
            border-bottom: 1px solid var(--border, #e5e5e5);
            background: var(--card, #ffffff);
          }
          .legal-logo {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -1px;
            color: var(--text, #000000);
            text-decoration: none;
          }
          .legal-login-btn {
            padding: 8px 16px;
            border: 1px solid var(--border, #e5e5e5);
            border-radius: 8px;
            background: var(--card, #ffffff);
            color: var(--text, #000000);
            text-decoration: none;
            font-weight: 600;
            transition: all 0.2s ease;
          }
          .legal-login-btn:hover {
            background: var(--surface, #f5f5f5);
          }
        `}</style>
        
        <header className="legal-header">
          <Link href="/" className="legal-logo">
            PitchRival
          </Link>
          <Link href="/login" className="legal-login-btn">
            Login
          </Link>
        </header>
        
        {children}
      </body>
    </html>
  )
}
