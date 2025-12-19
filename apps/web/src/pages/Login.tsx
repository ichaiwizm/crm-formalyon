import { useState, FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'

interface LoginProps {
  onSuccess: () => void
}

export function Login({ onSuccess }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loginError, isLoggingIn } = useAuth()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      await login({ email, password })
      onSuccess()
    } catch {
      // Error handled by loginError
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
      <h1>Formalyon CRM</h1>
      <h2>Connexion</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email">Email</label>
          <br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">Mot de passe</label>
          <br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        {loginError && (
          <div style={{ color: 'red', marginBottom: 16 }}>
            {loginError.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoggingIn}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          {isLoggingIn ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}
