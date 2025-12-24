import { prisma, type Prisma } from '@formalyon/database'

export async function list() {
  return prisma.company.findMany({
    orderBy: { createdAt: 'desc' },
  })
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
