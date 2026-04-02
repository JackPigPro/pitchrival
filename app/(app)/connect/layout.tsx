export default function ConnectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ flex: 1, padding: '24px 32px' }}>
      {children}
    </div>
  )
}
