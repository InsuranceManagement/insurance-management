import {
  ChartPoint,
  type InsuranceCompanyWithClientsRecord,
} from '@/modules/dashboard/entities/chart-point'
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
}
