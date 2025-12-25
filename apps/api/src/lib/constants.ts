// Prisma error codes
export const PRISMA_ERROR = {
  UNIQUE_CONSTRAINT: 'P2002',
  NOT_FOUND: 'P2025',
  FOREIGN_KEY_CONSTRAINT: 'P2003',
} as const

// Error messages (French)
export const ERROR_MESSAGE = {
  UNIQUE_CONSTRAINT: 'Un enregistrement avec ces données existe déjà',
  NOT_FOUND: 'Enregistrement non trouvé',
  FOREIGN_KEY_CONSTRAINT: 'Référence invalide',
  DATABASE_ERROR: 'Erreur base de données',
  VALIDATION_FAILED: 'Validation échouée',
  SERVER_ERROR: 'Erreur serveur',
  RATE_LIMITED: 'Trop de tentatives, réessayez plus tard',
} as const
