import LoginForm from './LoginForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>
}) {
  const sp = await searchParams
  const mode = sp.mode === 'signup' ? 'signup' : 'login'

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        background:
          'linear-gradient(135deg, var(--dark2) 0%, #1a2e40 55%, #0f2a1a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`.nav{display:none !important}`}</style>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          pointerEvents: 'none',
        }}
      />
      <LoginForm mode={mode} />
    </main>
  )
}
