import type { Metadata } from 'next'
import './globals.css'
import TopNav from '@/components/TopNav'
import { AppStateProvider } from '@/components/AppStateProvider'
import PageLayout from '@/components/PageLayout'

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
      <body>
        <AppStateProvider>
          <TopNav />
          <div style={{ paddingTop: '68px' }}>
            <PageLayout>
              {children}
            </PageLayout>
          </div>
        </AppStateProvider>
      </body>
    </html>
  )
}