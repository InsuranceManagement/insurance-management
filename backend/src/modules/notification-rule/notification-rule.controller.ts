import { DeleteManyDto } from '@/common/dto/delete-many.dto'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateNotificationRuleDto } from './dto/create-notification-rule.dto'
import { UpdateNotificationRuleDto } from './dto/update-notification-rule.dto'
import { NotificationRuleService } from './notification-rule.service'

@ApiBearerAuth()
@ApiTags('Notification rules')
@Controller('notification-rules')
export class NotificationRuleController {
  constructor(private readonly service: NotificationRuleService) {}

  @Post()
  create(@Body() input: CreateNotificationRuleDto) {
    return this.service.create(input)
  }

  @Get()
  list() {
    return this.service.list()
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateNotificationRuleDto) {
    return this.service.update(id, input)
  }

  @Post(':id/preview')
  preview(@Param('id') id: string) {
    return this.service.preview(id)
  }

  @Delete()
  delete(@Body() input: DeleteManyDto) {
    return this.service.delete(input)
  }
}
