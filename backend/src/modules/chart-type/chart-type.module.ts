import { Module } from '@nestjs/common'
import { ChartTypeController } from './chart-type.controller'
import { ChartTypeRepository } from './chart-type.repository'
import { ChartTypeService } from './services/chart-type.service'

@Module({
  controllers: [ChartTypeController],
  providers: [ChartTypeService, ChartTypeRepository],
  exports: [ChartTypeService],
})
export class ChartTypeModule {}
