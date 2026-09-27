import { PrismaService } from '@/modules/database/prisma.service'
import { Lead } from '@/modules/lead/entities/lead'
import { CreateLeadInput } from '@/modules/lead/inputs/create-lead.input'
import { UpdateLeadInput } from '@/modules/lead/inputs/update-lead.input'
import { Injectable } from '@nestjs/common'

@Injectable()
export class LeadRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: CreateLeadInput): Promise<Lead> {
    const lead = await this.prismaService.lead.create({
      data: {
        name: input.name,
        phoneNumber: input.phoneNumber,
      },
    })

    return Lead.fromPrisma(lead)
  }

  async findById(leadId: string): Promise<Lead | null> {
    const lead = await this.prismaService.lead.findFirst({
      where: {
        id: leadId,
        deletedAt: null,
      },
    })

    return lead ? Lead.fromPrisma(lead) : null
  }

  async list(): Promise<Lead[]> {
    const leads = await this.prismaService.lead.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    })

    return leads.map((lead) => Lead.fromPrisma(lead))
  }

  async update(leadId: string, input: UpdateLeadInput): Promise<void> {
    await this.prismaService.lead.update({
      where: {
        id: leadId,
      },
      data: {
        ...input,
      },
    })
  }

  async softDeleteMany(leadIds: string[]): Promise<number> {
    if (leadIds.length === 0) return 0

    const { count } = await this.prismaService.lead.updateMany({
      where: {
        id: {
          in: leadIds,
        },
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    })

    return count
  }
}

