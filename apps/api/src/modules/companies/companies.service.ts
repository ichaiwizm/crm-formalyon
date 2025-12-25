import { prisma, type Prisma, type Company } from '@formalyon/database'

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

export async function list(options: PaginationOptions = {}): Promise<PaginatedResult<Company>> {
  const limit = options.limit ?? DEFAULT_PAGE_SIZE
  const items = await prisma.company.findMany({
    take: limit + 1,
    ...(options.cursor && {
      skip: 1,
      cursor: { id: options.cursor },
    }),
    orderBy: { createdAt: 'desc' },
  })

  const hasMore = items.length > limit
  const data = hasMore ? items.slice(0, -1) : items
  const nextCursor = hasMore ? data[data.length - 1]?.id ?? null : null

  return { data, nextCursor, hasMore }
}

export async function getById(id: string) {
  return prisma.company.findUnique({
    where: { id },
    include: { leads: true },
  })
}

export async function create(data: Prisma.CompanyCreateInput) {
  return prisma.company.create({ data })
}

export async function update(id: string, data: Prisma.CompanyUpdateInput) {
  return prisma.company.update({
    where: { id },
    data,
  })
}

export async function remove(id: string) {
  return prisma.company.delete({ where: { id } })
}
