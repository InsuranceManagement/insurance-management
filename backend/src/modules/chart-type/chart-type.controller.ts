import { DeleteManyDto } from '@/common/dto/delete-many.dto'
import { CreateChartTypeDto } from '@/modules/chart-type/dto/create-chart-type.dto'
import { UpdateChartTypeDto } from '@/modules/chart-type/dto/update-chart-type.dto'
import { ChartTypeService } from '@/modules/chart-type/services/chart-type.service'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Chart Types')
@Controller('chart-types')
export class ChartTypeController {
  constructor(private readonly chartTypeService: ChartTypeService) {}

  @Post()
  create(@Body() input: CreateChartTypeDto) {
    return this.chartTypeService.create(input)
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.chartTypeService.getById(id)
  }

  @Get()
  list() {
    return this.chartTypeService.list()
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateChartTypeDto) {
    return this.chartTypeService.update(id, input)
  }

  @Delete()
  delete(@Body() input: DeleteManyDto) {
    return this.chartTypeService.delete(input.ids)
  }
}
