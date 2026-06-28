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

  @Get('clients-growth-by-month')
  getClientsGrowthByMonth() {
    return this.dashboardService.getClientsGrowthByMonth()
  }

  @Get('client-document-distribution')
  getClientDocumentDistribution() {
    return this.dashboardService.getClientDocumentDistribution()
  }
}
