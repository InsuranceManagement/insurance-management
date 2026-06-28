import { DashboardRepository } from '@/modules/dashboard/dashboard.repository'
import { ChartPoint } from '@/modules/dashboard/entities/chart-point'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getClientsByInsuranceCompany(): Promise<ChartPoint[]> {
    return this.dashboardRepository.getClientsByInsuranceCompanyPoints()
  }

  async getTotalClients(): Promise<number> {
    return this.dashboardRepository.getTotalClients()
  }

  async getClientsGrowthByMonth(): Promise<ChartPoint[]> {
    return this.dashboardRepository.getClientsGrowthByMonthPoints()
  }
}
