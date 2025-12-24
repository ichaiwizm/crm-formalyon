import type { Context } from 'hono'
import type { ZodError } from 'zod'
import { env } from '../lib/env'
import { logger } from '../lib/logger'
import { PRISMA_ERROR, ERROR_MESSAGE } from '../lib/constants'

interface PrismaError {
  code?: string
  meta?: { cause?: string }
}

export function errorHandler(err: Error, c: Context) {
  logger.error('API Error', err)

  // Prisma errors
  const prismaError = err as PrismaError
  if (prismaError.code) {
    switch (prismaError.code) {
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
  if (err.name === 'ZodError') {
    const zodError = err as ZodError
    const details = env.NODE_ENV === 'development'
      ? zodError.issues.map((e) => ({ path: e.path.join('.'), message: e.message }))
      : undefined
    return c.json({ error: ERROR_MESSAGE.VALIDATION_FAILED, details }, 400)
  }

  // Default error
  const message = env.NODE_ENV === 'development' ? err.message : ERROR_MESSAGE.SERVER_ERROR
  return c.json({ error: message }, 500)
}
