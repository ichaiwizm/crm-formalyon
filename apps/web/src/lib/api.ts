import type { User, AuthSession } from '@formalyon/shared'
import { env } from './env'

export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${env.API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erreur réseau' }))
    throw new Error(error.error || error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

export const authApi = {
  login: (email: string, password: string) =>
    api<{ user: User; token: string }>('/api/auth/sign-in/email', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, name: string) =>
    api<{ user: User; token: string }>('/api/auth/sign-up/email', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  logout: () =>
    api<{ success: boolean }>('/api/auth/sign-out', {
      method: 'POST',
      headers: { Origin: env.APP_URL },
      body: JSON.stringify({}),
    }),

  getSession: () =>
    api<AuthSession | null>('/api/auth/get-session'),
}
