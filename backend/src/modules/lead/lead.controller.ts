import { DeleteManyDto } from '@/common/dto/delete-many.dto'
import { CreateLeadDto } from '@/modules/lead/dto/create-lead.dto'
import { UpdateLeadDto } from '@/modules/lead/dto/update-lead.dto'
import { LeadService } from '@/modules/lead/services/lead.service'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger'

@ApiCookieAuth('access_token')
@ApiTags('Leads')
@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  create(@Body() input: CreateLeadDto) {
    return this.leadService.create(input)
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.leadService.getById(id)
  }

  @Get()
  list() {
    return this.leadService.list()
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateLeadDto) {
    return this.leadService.update(id, input)
  }

  @Delete()
  delete(@Body() input: DeleteManyDto) {
    return this.leadService.delete(input.ids)
  }
}

