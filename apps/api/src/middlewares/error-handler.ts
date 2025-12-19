import type { Context } from 'hono'
import { env } from '../lib/env'

interface PrismaError {
  code?: string
  meta?: { cause?: string }
}

export function errorHandler(err: Error, c: Context) {
  console.error('[API Error]', err)

  // Prisma errors
  const prismaError = err as PrismaError
  if (prismaError.code) {
    switch (prismaError.code) {
      case 'P2002':
        return c.json({ error: 'Un enregistrement avec ces données existe déjà' }, 409)
      case 'P2025':
        return c.json({ error: 'Enregistrement non trouvé' }, 404)
      case 'P2003':
        return c.json({ error: 'Référence invalide' }, 400)
      default:
        return c.json({ error: 'Erreur base de données' }, 500)
    }
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    return c.json({ error: 'Validation échouée', details: err }, 400)
  }

  // Default error
  const message = env.NODE_ENV === 'development' ? err.message : 'Erreur serveur'
  return c.json({ error: message }, 500)
}
