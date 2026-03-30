import Sidebar from '../../components/Sidebar'
import { AppStateProvider } from '../../components/AppStateProvider'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppStateProvider>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
        <Sidebar />
        <main style={{
          flex: 1, marginLeft: '224px', minHeight: '100vh', display: 'flex', flexDirection: 'column',
          backgroundImage: 'linear-gradient(rgba(21,128,61,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,.04) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
          filter: 'brightness(var(--ui-brightness, 100%))',
        }}>
          {children}
        </main>
      </div>
    </AppStateProvider>
  )
}