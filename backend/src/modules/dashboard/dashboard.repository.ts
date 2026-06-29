import {
  ChartPoint,
  type InsuranceCompanyWithClientsRecord,
} from '@/modules/dashboard/entities/chart-point'
import { ProductTypeHeatmap } from '@/modules/dashboard/entities/product-type-heatmap'
import { PrismaService } from '@/modules/database/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DashboardRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getClientsByInsuranceCompanyPoints(): Promise<ChartPoint[]> {
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
            },
            select: {
              clients: {
                where: {
                  deletedAt: null,
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

  async getTotalClients(): Promise<number> {
    return await this.prismaService.client.count({
      where: {
        deletedAt: null,
      },
    })
  }

  async getTotalProducts(): Promise<number> {
    return await this.prismaService.products.count({
      where: {
        deletedAt: null,
      },
    })
  }

  async getTotalInsuranceCompanies(): Promise<number> {
    return await this.prismaService.insuranceCompany.count({
      where: {
        deletedAt: null,
      },
    })
  }

  async getTotalProductTypes(): Promise<number> {
    return await this.prismaService.productType.count({
      where: {
        deletedAt: null,
      },
    })
  }

  async getClientsGrowthByMonthPoints(): Promise<ChartPoint[]> {
    const clients = await this.prismaService.client.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return ChartPoint.fromClientsGrowthByMonthPrisma(clients)
  }

  async getClientDocumentDistributionPoints(): Promise<ChartPoint[]> {
    const clients = await this.prismaService.client.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        cpf: true,
        cnpj: true,
      },
    })

    return ChartPoint.fromClientDocumentDistributionPrisma(clients)
  }

  async getClientAgeRangePoints(): Promise<ChartPoint[]> {
    const clients = await this.prismaService.client.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        birthDate: true,
      },
    })

    return ChartPoint.fromClientAgeRangePrisma(clients)
  }

  async getProductTypesByInsuranceCompanyHeatmap(): Promise<ProductTypeHeatmap> {
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
}
