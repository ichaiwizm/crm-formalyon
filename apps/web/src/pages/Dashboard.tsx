import { useAuth } from '../hooks/useAuth'

interface DashboardProps {
  onLogout: () => void
}

export function Dashboard({ onLogout }: DashboardProps) {
  const { user, logout } = useAuth()

  async function handleLogout() {
    await logout()
    onLogout()
  }

  return (
    <div style={{ padding: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <h1>Formalyon CRM</h1>
        <div>
          <span style={{ marginRight: 16 }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            Déconnexion
          </button>
        </div>
      </header>

      <main>
        <h2>Bienvenue {user?.name || user?.email}</h2>
        <p>Vous êtes connecté au CRM Formalyon.</p>
      </main>
    </div>
  )
}
