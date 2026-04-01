export default function CompeteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flex: 1, padding: '24px 32px' }}>
        {children}
      </div>
    </div>
  )
}
