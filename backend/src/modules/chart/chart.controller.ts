import { CreateChartDto } from '@/modules/chart/dto/create-chart.dto'
import { UpdateChartDto } from '@/modules/chart/dto/update-chart.dto'
import { ChartService } from '@/modules/chart/services/chart.service'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Charts')
@Controller('charts')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Post()
  create(@Body() input: CreateChartDto) {
    return this.chartService.create(input)
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.chartService.getById(id)
  }

  @Get()
  list() {
    return this.chartService.list()
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateChartDto) {
    return this.chartService.update(id, input)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.chartService.delete(id)
  }
}
