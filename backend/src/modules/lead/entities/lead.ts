import { Prisma } from '@generated/prisma'

type PrismaLead = Prisma.LeadGetPayload<Record<string, never>>

export class Lead {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly phoneNumber: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}

  isActive(): boolean {
    return this.deletedAt === null
  }

  static fromPrisma(lead: PrismaLead): Lead {
    return new Lead(
      lead.id,
      lead.name,
      lead.phoneNumber,
      lead.createdAt,
      lead.updatedAt,
      lead.deletedAt,
    )
  }
}

