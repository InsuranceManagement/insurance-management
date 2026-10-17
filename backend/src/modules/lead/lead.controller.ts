import { Public } from '@/common/auth/auth.decorators'
import { AUTH_COOKIE_NAME } from '@/common/auth/cookie.constants'
import { DeleteManyDto } from '@/common/dto/delete-many.dto'
import { CreateLeadDto } from '@/modules/lead/dto/create-lead.dto'
import { LeadService } from '@/modules/lead/services/lead.service'
import { Body, Controller, Delete, Get, Post } from '@nestjs/common'
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('Leads')
@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

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

  @Delete()
  @ApiCookieAuth(AUTH_COOKIE_NAME)
  delete(@Body() input: DeleteManyDto) {
    return this.leadService.delete(input.ids)
  }
}
