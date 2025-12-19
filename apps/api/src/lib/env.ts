import 'dotenv/config'

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

export const env = {
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: parseInt(getEnv('PORT', '3000'), 10),
  DATABASE_URL: getEnv('DATABASE_URL'),
  BETTER_AUTH_SECRET: getEnv('BETTER_AUTH_SECRET'),
  BETTER_AUTH_URL: getEnv('BETTER_AUTH_URL', 'http://localhost:3000'),
  CORS_ORIGIN: getEnv('CORS_ORIGIN', 'http://localhost:5173'),
} as const
