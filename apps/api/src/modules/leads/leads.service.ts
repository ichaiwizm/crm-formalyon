import { prisma, type Prisma } from '@formalyon/database'

export async function list() {
  return prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: { company: true },
  })
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
