import { Module } from '@nestjs/common'
import { ChartTypeModule } from '../chart-type/chart-type.module'
import { ChartController } from './chart.controller'
import { ChartRepository } from './chart.repository'
import { ChartService } from './services/chart.service'

@Module({
  imports: [ChartTypeModule],
  controllers: [ChartController],
  providers: [ChartService, ChartRepository],
})
export class ChartModule {}
