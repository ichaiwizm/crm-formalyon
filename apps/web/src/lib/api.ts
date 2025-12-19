const API_URL = 'http://localhost:3000'

export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `HTTP ${response.status}`)
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
      headers: { Origin: 'http://localhost:5173' },
      body: JSON.stringify({}),
    }),

  getSession: () =>
    api<{ user: User; session: Session } | null>('/api/auth/get-session'),
}

export interface User {
  id: string
  email: string
  name: string | null
  emailVerified: boolean
  image: string | null
  createdAt: string
  updatedAt: string
}

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: string
}
