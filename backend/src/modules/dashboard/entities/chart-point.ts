import type { InsuranceCompanyGetPayload } from '@generated/prisma/models/InsuranceCompany'

export type InsuranceCompanyWithClientsRecord = InsuranceCompanyGetPayload<{
  select: {
    id: true
    name: true
    color: true
    products: {
      select: {
        clients: {
          select: {
            id: true
          }
        }
      }
    }
  }
}>

export class ChartPoint {
  constructor(
    public readonly y: number,
    public readonly name?: string,
    public readonly x?: number | string,
    public readonly color?: string,
  ) {}

  static fromInsuranceCompanyWithClientsPrisma(
    companies: InsuranceCompanyWithClientsRecord[],
  ): ChartPoint[] {
    const points = companies
      .map((company) => {
        const uniqueClientsCount = this.getUniqueClientsCountByInsuranceCompany(company)

        return new ChartPoint(uniqueClientsCount, company.name, undefined, company.color)
      })
      .sort((a, b) => {
        if (b.y !== a.y) {
          return b.y - a.y
        }

        return (a.name ?? '').localeCompare(b.name ?? '')
      })

    return points
  }

  private static getUniqueClientsCountByInsuranceCompany(
    company: InsuranceCompanyWithClientsRecord,
  ): number {
    const uniqueClients = new Set(
      company.products.flatMap((product) => product.clients.map((client) => client.id)),
    )

    return uniqueClients.size
  }
}
