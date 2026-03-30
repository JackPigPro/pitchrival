import Sidebar from '../../components/Sidebar'
import { AppStateProvider } from '../../components/AppStateProvider'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '224px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppStateProvider>{children}</AppStateProvider>
      </main>
    </div>
  )
}