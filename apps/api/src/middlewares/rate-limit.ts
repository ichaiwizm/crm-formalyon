import type { Context, Next } from 'hono'
import { ERROR_MESSAGE } from '../lib/constants'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS = 5 // 5 attempts per window

function getClientIp(c: Context): string {
  return c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
    ?? c.req.header('x-real-ip')
    ?? 'unknown'
}

export function rateLimit(c: Context, next: Next) {
  const ip = getClientIp(c)
  const now = Date.now()
  const entry = store.get(ip)

  // Clean expired entries periodically
  if (store.size > 10000) {
    for (const [key, val] of store) {
      if (val.resetAt < now) store.delete(key)
    }
  }

  if (!entry || entry.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return next()
  }

  if (entry.count >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    c.header('Retry-After', String(retryAfter))
    return c.json({ error: ERROR_MESSAGE.RATE_LIMITED }, 429)
  }

  entry.count++
  return next()
}
