import { CreateTemplateInput } from '@/modules/notifications/inputs/create-template.input'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsObject, IsOptional, IsString, ValidateIf } from 'class-validator'

export class CreateTemplateDto implements CreateTemplateInput {
  @ApiProperty({ description: 'Template name' })
  @IsString({ message: 'O nome do template deve ser um texto.' })
  name!: string

  @ApiProperty({ description: 'Template description', type: String, nullable: true })
  @ValidateIf((_, value) => value !== null)
  @IsString({ message: 'A descrição do template deve ser um texto.' })
  description!: string | null

  @ApiProperty({ description: 'E-mail subject' })
  @IsString({ message: 'O assunto do template deve ser um texto.' })
  subject!: string

  @ApiProperty({ description: 'Template body (HTML)' })
  @IsString({ message: 'O corpo do template deve ser um texto.' })
  body!: string

  @ApiPropertyOptional({ description: 'Variables accepted by the template' })
  @IsOptional()
  @IsObject({ message: 'O esquema de variáveis deve ser um objeto.' })
  variableSchema?: Record<string, string>

  @ApiPropertyOptional({ description: 'Whether the template is active' })
  @IsOptional()
  @IsBoolean({ message: 'O campo ativo deve ser um booleano.' })
  isActive?: boolean

  @ApiPropertyOptional({ description: 'Notification type id' })
  @IsOptional()
  @IsString({ message: 'O ID do tipo de notificação deve ser um texto.' })
  notificationTypeId?: string
}
