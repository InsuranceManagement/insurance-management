import { DashboardService } from '@/modules/dashboard/services/dashboard.service'
import { Controller, Get, Query } from '@nestjs/common'
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger'
import { DashboardDateRangeDto } from './dto/dashboard-date-range.dto'

@ApiCookieAuth('access_token')
@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('clients-by-insurance-company')
  getClientsByInsuranceCompany(@Query() input: DashboardDateRangeDto) {
    return this.dashboardService.getClientsByInsuranceCompany(input)
  }

  @Get('kpi-total-clients')
  async getTotalClients(@Query() input: DashboardDateRangeDto) {
    return this.dashboardService.getTotalClients(input)
  }

  @Get('kpi-total-products')
  async getTotalProducts(@Query() input: DashboardDateRangeDto) {
    return this.dashboardService.getTotalProducts(input)
  }

  @Get('kpi-total-insurance-companies')
  async getTotalInsuranceCompanies(@Query() input: DashboardDateRangeDto) {
    return this.dashboardService.getTotalInsuranceCompanies(input)
  }

  @Get('kpi-total-product-types')
  async getTotalProductTypes(@Query() input: DashboardDateRangeDto) {
    return this.dashboardService.getTotalProductTypes(input)
  }

  @Get('clients-growth-by-month')
  getClientsGrowthByMonth(@Query() input: DashboardDateRangeDto) {
    return this.dashboardService.getClientsGrowthByMonth(input)
  }

  @Get('client-document-distribution')
  getClientDocumentDistribution(@Query() input: DashboardDateRangeDto) {
    return this.dashboardService.getClientDocumentDistribution(input)
  }

  @Get('client-age-range')
  getClientAgeRange(@Query() input: DashboardDateRangeDto) {
    return this.dashboardService.getClientAgeRange(input)
  }

  @Get('product-types-by-insurance-company')
  getProductTypesByInsuranceCompany(@Query() input: DashboardDateRangeDto) {
    return this.dashboardService.getProductTypesByInsuranceCompany(input)
  }
}
