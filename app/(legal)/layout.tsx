import TopNav from '@/components/TopNav'

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <TopNav forceLoggedOut={true} />
          <div style={{ paddingTop: '68px' }}>
            {children}
          </div>
      </body>
    </html>
  )
}
