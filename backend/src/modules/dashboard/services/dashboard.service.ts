import { DashboardRepository } from '@/modules/dashboard/dashboard.repository'
import { ChartPoint } from '@/modules/dashboard/entities/chart-point'
import { ProductTypeHeatmap } from '@/modules/dashboard/entities/product-type-heatmap'
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

  async getTotalProducts(): Promise<number> {
    return this.dashboardRepository.getTotalProducts()
  }

  async getClientsGrowthByMonth(): Promise<ChartPoint[]> {
    return this.dashboardRepository.getClientsGrowthByMonthPoints()
  }

  async getClientDocumentDistribution(): Promise<ChartPoint[]> {
    return this.dashboardRepository.getClientDocumentDistributionPoints()
  }

  async getClientAgeRange(): Promise<ChartPoint[]> {
    return this.dashboardRepository.getClientAgeRangePoints()
  }

  async getProductTypesByInsuranceCompany(): Promise<ProductTypeHeatmap> {
    return this.dashboardRepository.getProductTypesByInsuranceCompanyHeatmap()
  }
}
