import { CreateTemplateDto } from '@/modules/notifications/dto/create-template.dto'
import { UpdateTemplateDto } from '@/modules/notifications/dto/update-template.dto'
import { NotificationsService } from '@/modules/notifications/services/notifications.service'
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('logs')
  getLogs() {
    return this.notificationsService.getLogs()
  }

  @Post('templates')
  createTemplate(@Body() input: CreateTemplateDto) {
    return this.notificationsService.createTemplate(input)
  }

  @Put('templates/:id')
  updateTemplate(@Param('id') id: string, @Body() input: UpdateTemplateDto) {
    return this.notificationsService.updateTemplate(id, input)
  }
}
