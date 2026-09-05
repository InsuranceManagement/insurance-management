import type { VisitModel as PrismaVisit } from '@generated/prisma/models/Visit'

export class Visit {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly clientId: string,
    public readonly date: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromPrisma(visit: PrismaVisit): Visit {
    return new Visit(
      visit.id,
      visit.name,
      visit.description,
      visit.clientId,
      visit.date,
      visit.createdAt,
      visit.updatedAt,
    )
  }
}
