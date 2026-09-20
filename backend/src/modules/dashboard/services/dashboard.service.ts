import { DashboardRepository } from '@/modules/dashboard/dashboard.repository'
import { ChartPoint } from '@/modules/dashboard/entities/chart-point'
import { ProductTypeHeatmap } from '@/modules/dashboard/entities/product-type-heatmap'
import { BadRequestException, Injectable } from '@nestjs/common'
import { DashboardDateRangeInput } from '../inputs/dashboard-date-range.input'

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getClientsByInsuranceCompany(input: DashboardDateRangeInput): Promise<ChartPoint[]> {
    this.validateDateRange(input)
    return this.dashboardRepository.getClientsByInsuranceCompanyPoints(input)
  }

  async getTotalClients(input: DashboardDateRangeInput): Promise<number> {
    this.validateDateRange(input)
    return this.dashboardRepository.getTotalClients(input)
  }

  async getTotalProducts(input: DashboardDateRangeInput): Promise<number> {
    this.validateDateRange(input)
    return this.dashboardRepository.getTotalProducts(input)
  }

  async getTotalInsuranceCompanies(input: DashboardDateRangeInput): Promise<number> {
    this.validateDateRange(input)
    return this.dashboardRepository.getTotalInsuranceCompanies(input)
  }

  async getTotalProductTypes(input: DashboardDateRangeInput): Promise<number> {
    this.validateDateRange(input)
    return this.dashboardRepository.getTotalProductTypes(input)
  }

  async getClientsGrowthByMonth(input: DashboardDateRangeInput): Promise<ChartPoint[]> {
    this.validateDateRange(input)
    return this.dashboardRepository.getClientsGrowthByMonthPoints(input)
  }

  async getClientDocumentDistribution(input: DashboardDateRangeInput): Promise<ChartPoint[]> {
    this.validateDateRange(input)
    return this.dashboardRepository.getClientDocumentDistributionPoints(input)
  }

  async getClientAgeRange(input: DashboardDateRangeInput): Promise<ChartPoint[]> {
    this.validateDateRange(input)
    return this.dashboardRepository.getClientAgeRangePoints(input)
  }

  async getProductTypesByInsuranceCompany(
    input: DashboardDateRangeInput,
  ): Promise<ProductTypeHeatmap> {
    this.validateDateRange(input)
    return this.dashboardRepository.getProductTypesByInsuranceCompanyHeatmap(input)
  }

  private validateDateRange({ startDate, endDate }: DashboardDateRangeInput): void {
    if (Boolean(startDate) !== Boolean(endDate)) {
      throw new BadRequestException('Informe a data inicial e a data final do período.')
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      throw new BadRequestException('A data inicial deve ser anterior ou igual à data final.')
    }
  }
}
