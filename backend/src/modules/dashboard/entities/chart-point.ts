import type { InsuranceCompanyGetPayload } from '@generated/prisma/models/InsuranceCompany'
import type { ClientModel } from '@generated/prisma/models/Client'

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

  static fromClientsGrowthByMonthPrisma(clients: Pick<ClientModel, 'createdAt'>[]): ChartPoint[] {
    if (clients.length === 0) {
      return []
    }

    const clientsByMonth = this.countClientsByMonth(clients)
    const orderedMonths = this.getMonthRange(
      this.getMonthKey(clients[0].createdAt),
      this.getMonthKey(clients[clients.length - 1].createdAt),
    )

    let accumulatedClients = 0

    return orderedMonths.map((monthKey) => {
      accumulatedClients += clientsByMonth.get(monthKey) ?? 0

      return new ChartPoint(accumulatedClients, this.formatMonthLabel(monthKey))
    })
  }

  private static getUniqueClientsCountByInsuranceCompany(
    company: InsuranceCompanyWithClientsRecord,
  ): number {
    const uniqueClients = new Set(
      company.products.flatMap((product) => product.clients.map((client) => client.id)),
    )

    return uniqueClients.size
  }

  private static countClientsByMonth(clients: Pick<ClientModel, 'createdAt'>[]): Map<string, number> {
    return clients.reduce((acc, client) => {
      const monthKey = this.getMonthKey(client.createdAt)
      const currentCount = acc.get(monthKey) ?? 0

      acc.set(monthKey, currentCount + 1)

      return acc
    }, new Map<string, number>())
  }

  private static getMonthRange(startMonthKey: string, endMonthKey: string): string[] {
    const [startYear, startMonth] = startMonthKey.split('-').map(Number)
    const [endYear, endMonth] = endMonthKey.split('-').map(Number)
    const currentDate = new Date(Date.UTC(startYear, startMonth - 1, 1))
    const endDate = new Date(Date.UTC(endYear, endMonth - 1, 1))
    const monthKeys: string[] = []

    while (currentDate <= endDate) {
      monthKeys.push(this.getMonthKey(currentDate))
      currentDate.setUTCMonth(currentDate.getUTCMonth() + 1)
    }

    return monthKeys
  }

  private static getMonthKey(date: Date): string {
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')

    return `${year}-${month}`
  }

  private static formatMonthLabel(monthKey: string): string {
    const [year, month] = monthKey.split('-')
    const monthLabels = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ]

    return `${monthLabels[Number(month) - 1]}/${year}`
  }
}
