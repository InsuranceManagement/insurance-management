import {
  ChartPoint,
  type InsuranceCompanyWithClientsRecord,
} from '@/modules/dashboard/entities/chart-point'
import { ProductTypeHeatmap } from '@/modules/dashboard/entities/product-type-heatmap'
import { PrismaService } from '@/modules/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { DashboardDateRangeInput } from './inputs/dashboard-date-range.input'

@Injectable()
export class DashboardRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getClientsByInsuranceCompanyPoints(input: DashboardDateRangeInput): Promise<ChartPoint[]> {
    const companies: InsuranceCompanyWithClientsRecord[] =
      await this.prismaService.insuranceCompany.findMany({
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          color: true,
          products: {
            where: {
              deletedAt: null,
              productType: {
                deletedAt: null,
              },
            },
            select: {
              clients: {
                where: {
                  deletedAt: null,
                  createdAt: this.createdAtFilter(input),
                },
                select: {
                  id: true,
                },
              },
            },
          },
        },
      })

    return ChartPoint.fromInsuranceCompanyWithClientsPrisma(companies)
  }

  async getTotalClients(input: DashboardDateRangeInput): Promise<number> {
    return await this.prismaService.client.count({
      where: {
        deletedAt: null,
        createdAt: this.createdAtFilter(input),
      },
    })
  }

  async getTotalProducts(input: DashboardDateRangeInput): Promise<number> {
    return await this.prismaService.products.count({
      where: {
        deletedAt: null,
        createdAt: this.createdAtFilter(input),
      },
    })
  }

  async getTotalInsuranceCompanies(input: DashboardDateRangeInput): Promise<number> {
    return await this.prismaService.insuranceCompany.count({
      where: {
        deletedAt: null,
        createdAt: this.createdAtFilter(input),
      },
    })
  }

  async getTotalProductTypes(input: DashboardDateRangeInput): Promise<number> {
    return await this.prismaService.productType.count({
      where: {
        deletedAt: null,
        createdAt: this.createdAtFilter(input),
      },
    })
  }

  async getClientsGrowthByMonthPoints(input: DashboardDateRangeInput): Promise<ChartPoint[]> {
    const clients = await this.prismaService.client.findMany({
      where: {
        deletedAt: null,
        createdAt: this.createdAtFilter(input),
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return ChartPoint.fromClientsGrowthByMonthPrisma(clients, input)
  }

  async getClientDocumentDistributionPoints(input: DashboardDateRangeInput): Promise<ChartPoint[]> {
    const clients = await this.prismaService.client.findMany({
      where: {
        deletedAt: null,
        createdAt: this.createdAtFilter(input),
      },
      select: {
        cpf: true,
        cnpj: true,
      },
    })

    return ChartPoint.fromClientDocumentDistributionPrisma(clients)
  }

  async getClientAgeRangePoints(input: DashboardDateRangeInput): Promise<ChartPoint[]> {
    const clients = await this.prismaService.client.findMany({
      where: {
        deletedAt: null,
        createdAt: this.createdAtFilter(input),
      },
      select: {
        birthDate: true,
      },
    })

    return ChartPoint.fromClientAgeRangePrisma(clients)
  }

  async getProductTypesByInsuranceCompanyHeatmap(
    input: DashboardDateRangeInput,
  ): Promise<ProductTypeHeatmap> {
    const [companies, productTypes] = await Promise.all([
      this.prismaService.insuranceCompany.findMany({
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          color: true,
          products: {
            where: {
              deletedAt: null,
              createdAt: this.createdAtFilter(input),
              productType: {
                deletedAt: null,
              },
            },
            select: {
              productType: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
      this.prismaService.productType.findMany({
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
    ])

    return ProductTypeHeatmap.fromPrisma(companies, productTypes)
  }

  private createdAtFilter(input: DashboardDateRangeInput): { gte?: Date; lte?: Date } | undefined {
    const filter: { gte?: Date; lte?: Date } = {}

    if (input.startDate) filter.gte = new Date(input.startDate)
    if (input.endDate) filter.lte = new Date(input.endDate)

    return Object.keys(filter).length > 0 ? filter : undefined
  }
}
