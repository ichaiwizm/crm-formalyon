import { z } from 'zod'

export const createCompanySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  siret: z.string().length(14, 'Le SIRET doit contenir 14 chiffres').optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email invalide').optional(),
})

export const updateCompanySchema = createCompanySchema.partial()

export type CreateCompanyInput = z.infer<typeof createCompanySchema>
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>
