import { z } from 'zod'
import { LEAD_STATUSES } from '@formalyon/shared'

export const createLeadSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide').optional(),
  phone: z.string().optional(),
  status: z.enum(LEAD_STATUSES).default('NEW'),
  companyId: z.string().optional(),
})

export const updateLeadSchema = createLeadSchema.partial()
