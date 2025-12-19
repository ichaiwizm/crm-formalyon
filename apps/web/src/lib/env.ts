export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  APP_URL: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
} as const
