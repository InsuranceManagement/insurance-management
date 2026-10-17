import { Public } from '@/common/auth/auth.decorators'
import { AUTH_COOKIE_NAME } from '@/common/auth/cookie.constants'
import { DeleteManyDto } from '@/common/dto/delete-many.dto'
import { CreateLeadDto } from '@/modules/lead/dto/create-lead.dto'
import { ConvertLeadDto } from '@/modules/lead/dto/convert-lead.dto'
import { ClientService } from '@/modules/client/services/client.service'
import { ClientResponseDto } from '@/modules/client/dto/client-response.dto'
import { LeadService } from '@/modules/lead/services/lead.service'
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ApiCookieAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Leads')
@Controller('leads')
export class LeadController {
  constructor(
    private readonly leadService: LeadService,
    private readonly clientService: ClientService,
  ) {}

  @Public()
  @Post()
  create(@Body() input: CreateLeadDto) {
    return this.leadService.create(input)
  }

  @Get()
  @ApiCookieAuth(AUTH_COOKIE_NAME)
  list() {
    return this.leadService.list()
  }

  @Post(':id/convert')
  @ApiCookieAuth(AUTH_COOKIE_NAME)
  @ApiCreatedResponse({ type: ClientResponseDto })
  convert(@Param('id') id: string, @Body() input: ConvertLeadDto) {
    return this.clientService.convertLead(id, input)
  }

  @Delete()
  @ApiCookieAuth(AUTH_COOKIE_NAME)
  delete(@Body() input: DeleteManyDto) {
    return this.leadService.delete(input.ids)
  }
}
