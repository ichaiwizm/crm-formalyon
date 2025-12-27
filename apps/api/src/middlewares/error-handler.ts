import type { Context } from 'hono'
import { ZodError } from 'zod'
import { env } from '../lib/env'
import { logger } from '../lib/logger'
import { PRISMA_ERROR, ERROR_MESSAGE } from '../lib/constants'

function isPrismaError(err: unknown): err is { code: string } {
  return typeof err === 'object' && err !== null && 'code' in err
}

export function errorHandler(err: Error, c: Context) {
  logger.error('API Error', err)

  // Prisma errors
  if (isPrismaError(err)) {
    switch (err.code) {
      case PRISMA_ERROR.UNIQUE_CONSTRAINT:
        return c.json({ error: ERROR_MESSAGE.UNIQUE_CONSTRAINT }, 409)
      case PRISMA_ERROR.NOT_FOUND:
        return c.json({ error: ERROR_MESSAGE.NOT_FOUND }, 404)
      case PRISMA_ERROR.FOREIGN_KEY_CONSTRAINT:
        return c.json({ error: ERROR_MESSAGE.FOREIGN_KEY_CONSTRAINT }, 400)
      default:
        return c.json({ error: ERROR_MESSAGE.DATABASE_ERROR }, 500)
    }
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const details = env.NODE_ENV === 'development'
      ? err.issues.map((e) => ({ path: e.path.join('.'), message: e.message }))
      : undefined
    return c.json({ error: ERROR_MESSAGE.VALIDATION_FAILED, details }, 400)
  }

  // Default error
  const message = env.NODE_ENV === 'development' ? err.message : ERROR_MESSAGE.SERVER_ERROR
  return c.json({ error: message }, 500)
}
