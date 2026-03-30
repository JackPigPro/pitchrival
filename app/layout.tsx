import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PitchRival — Where founders get good.',
  description:
    'Share your idea. Build your rank. Find your co-founder. Learn how to do it all — free.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}