// Lead status values - single source of truth
export const LEAD_STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]
