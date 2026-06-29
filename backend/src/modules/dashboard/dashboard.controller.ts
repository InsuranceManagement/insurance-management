import { DashboardService } from '@/modules/dashboard/services/dashboard.service'
import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('clients-by-insurance-company')
  getClientsByInsuranceCompany() {
    return this.dashboardService.getClientsByInsuranceCompany()
  }

  @Get('kpi-total-clients')
  async getTotalClients() {
    return this.dashboardService.getTotalClients()
  }

  @Get('kpi-total-products')
  async getTotalProducts() {
    return this.dashboardService.getTotalProducts()
  }

  @Get('kpi-total-insurance-companies')
  async getTotalInsuranceCompanies() {
    return this.dashboardService.getTotalInsuranceCompanies()
  }

  @Get('clients-growth-by-month')
  getClientsGrowthByMonth() {
    return this.dashboardService.getClientsGrowthByMonth()
  }

  @Get('client-document-distribution')
  getClientDocumentDistribution() {
    return this.dashboardService.getClientDocumentDistribution()
  }

  @Get('client-age-range')
  getClientAgeRange() {
    return this.dashboardService.getClientAgeRange()
  }

  @Get('product-types-by-insurance-company')
  getProductTypesByInsuranceCompany() {
    return this.dashboardService.getProductTypesByInsuranceCompany()
  }
}
