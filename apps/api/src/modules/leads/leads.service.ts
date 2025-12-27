import { prisma, type Prisma } from '@formalyon/database'

const DEFAULT_PAGE_SIZE = 20

interface PaginationOptions {
  cursor?: string
  limit?: number
}

interface PaginatedResult<T> {
  data: T[]
  nextCursor: string | null
  hasMore: boolean
}

export async function list(options: PaginationOptions = {}): Promise<PaginatedResult<Prisma.LeadGetPayload<{ include: { company: true } }>>> {
  const limit = options.limit ?? DEFAULT_PAGE_SIZE
  const items = await prisma.lead.findMany({
    take: limit + 1,
    ...(options.cursor && {
      skip: 1,
      cursor: { id: options.cursor },
    }),
    orderBy: { createdAt: 'desc' },
    include: { company: true },
  })

  const hasMore = items.length > limit
  const data = hasMore ? items.slice(0, -1) : items
  const nextCursor = hasMore ? data[data.length - 1]?.id ?? null : null

  return { data, nextCursor, hasMore }
}

export async function getById(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: { company: true },
  })
}

export async function create(data: Prisma.LeadUncheckedCreateInput) {
  return prisma.lead.create({
    data,
    include: { company: true },
  })
}

export async function update(id: string, data: Prisma.LeadUncheckedUpdateInput) {
  return prisma.lead.update({
    where: { id },
    data,
    include: { company: true },
  })
}

export async function remove(id: string) {
  return prisma.lead.delete({ where: { id } })
}
