import { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'

function App() {
  const { isAuthenticated, isLoading } = useAuth()
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard'>('login')

  useEffect(() => {
    if (!isLoading) {
      setCurrentPage(isAuthenticated ? 'dashboard' : 'login')
    }
  }, [isAuthenticated, isLoading])

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Chargement...
      </div>
    )
  }

  if (currentPage === 'login') {
    return <Login onSuccess={() => setCurrentPage('dashboard')} />
  }

  return <Dashboard onLogout={() => setCurrentPage('login')} />
}

export default App
