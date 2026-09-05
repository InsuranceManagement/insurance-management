import { PrismaService } from '@/modules/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { CreateVisitDto } from './dto/create-visit.dto'
import { ListVisitsDto } from './dto/list-visits.dto'
import { UpdateVisitDto } from './dto/update-visit.dto'
import { Visit } from './entities/visit'

@Injectable()
export class VisitRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateVisitDto): Promise<Visit> {
    const visit = await this.prisma.visit.create({
      data: { ...input, date: new Date(input.date) },
    })
    return Visit.fromPrisma(visit)
  }

  async findById(id: string): Promise<Visit | null> {
    const visit = await this.prisma.visit.findFirst({ where: { id, deletedAt: null } })
    return visit ? Visit.fromPrisma(visit) : null
  }

  async list(input: ListVisitsDto): Promise<Visit[]> {
    const visits = await this.prisma.visit.findMany({
      where: {
        deletedAt: null,
        date: {
          gte: input.startDate ? new Date(input.startDate) : undefined,
          lte: input.endDate ? new Date(input.endDate) : undefined,
        },
      },
      orderBy: [{ date: 'asc' }, { id: 'asc' }],
    })
    return visits.map((visit) => Visit.fromPrisma(visit))
  }

  async update(id: string, input: UpdateVisitDto): Promise<Visit> {
    const visit = await this.prisma.visit.update({
      where: { id, deletedAt: null },
      data: { ...input, date: input.date === undefined ? undefined : new Date(input.date) },
    })
    return Visit.fromPrisma(visit)
  }

  async delete(id: string): Promise<number> {
    const { count } = await this.prisma.visit.deleteMany({ where: { id } })
    return count
  }

  async clientExists(id: string): Promise<boolean> {
    return !!(await this.prisma.client.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    }))
  }
}
