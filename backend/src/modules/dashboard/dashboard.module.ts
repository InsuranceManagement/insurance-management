import { DashboardController } from '@/modules/dashboard/dashboard.controller'
import { DashboardRepository } from '@/modules/dashboard/dashboard.repository'
import { DashboardService } from '@/modules/dashboard/services/dashboard.service'
import { Module } from '@nestjs/common'

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
})
export class DashboardModule {}
