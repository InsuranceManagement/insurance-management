import { CreateChartDto } from '@/modules/chart/dto/create-chart.dto'
import { UpdateChartInput } from '@/modules/chart/inputs/update-chart.input'
import { PartialType } from '@nestjs/swagger'

export class UpdateChartDto extends PartialType(CreateChartDto) implements UpdateChartInput {}
