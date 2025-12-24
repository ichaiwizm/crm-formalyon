import type { LeadStatus } from './constants'

// Auth types
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
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthSession {
  user: User
  session: Session
}

// Company types
export interface Company {
  id: string
  name: string
  siret: string | null
  address: string | null
  city: string | null
  zipCode: string | null
  phone: string | null
  email: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateCompanyInput {
  name: string
  siret?: string
  address?: string
  city?: string
  zipCode?: string
  phone?: string
  email?: string
}

export interface UpdateCompanyInput {
  name?: string
  siret?: string
  address?: string
  city?: string
  zipCode?: string
  phone?: string
  email?: string
}

// Lead types
export type { LeadStatus } from './constants'

export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  status: LeadStatus
  companyId: string | null
  createdAt: string
  updatedAt: string
  company?: Company | null
}

export interface CreateLeadInput {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  status?: LeadStatus
  companyId?: string
}

export interface UpdateLeadInput {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  status?: LeadStatus
  companyId?: string
}

// API Response types
export interface ApiError {
  error: string
  details?: unknown
}
