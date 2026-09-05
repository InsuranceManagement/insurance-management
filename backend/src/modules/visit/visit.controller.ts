import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateVisitDto } from './dto/create-visit.dto'
import { ListVisitsDto } from './dto/list-visits.dto'
import { UpdateVisitDto } from './dto/update-visit.dto'
import { VisitService } from './visit.service'

@ApiBearerAuth()
@ApiTags('Visits')
@Controller('visits')
export class VisitController {
  constructor(private readonly service: VisitService) {}

  @Post()
  create(@Body() input: CreateVisitDto) {
    return this.service.create(input)
  }

  @Get()
  list(@Query() input: ListVisitsDto) {
    return this.service.list(input)
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateVisitDto) {
    return this.service.update(id, input)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.service.delete(id)
  }
}
