import { UpdateTemplateInput } from '@/modules/notifications/inputs/update-template.input'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsObject, IsString, ValidateIf } from 'class-validator'

// O MS exige as 7 chaves presentes no corpo do PUT, mesmo que o valor seja null
// (não aceita corpo parcial hoje — ver relatório de bug). Por isso, diferente dos
// outros DTOs de update do projeto, nenhum campo aqui é @IsOptional(): a chave é
// obrigatória, só o valor pode ser null.
export class UpdateTemplateDto implements UpdateTemplateInput {
  @ApiProperty({ description: 'Template name', type: String, nullable: true })
  @ValidateIf((_, value) => value !== null)
  @IsString({ message: 'O nome do template deve ser um texto.' })
  name!: string | null

  @ApiProperty({ description: 'Template description', type: String, nullable: true })
  @ValidateIf((_, value) => value !== null)
  @IsString({ message: 'A descrição do template deve ser um texto.' })
  description!: string | null

  @ApiProperty({ description: 'E-mail subject', type: String, nullable: true })
  @ValidateIf((_, value) => value !== null)
  @IsString({ message: 'O assunto do template deve ser um texto.' })
  subject!: string | null

  @ApiProperty({ description: 'Template body (HTML)', type: String, nullable: true })
  @ValidateIf((_, value) => value !== null)
  @IsString({ message: 'O corpo do template deve ser um texto.' })
  body!: string | null

  @ApiProperty({ description: 'Variables accepted by the template', nullable: true })
  @ValidateIf((_, value) => value !== null)
  @IsObject({ message: 'O esquema de variáveis deve ser um objeto.' })
  variableSchema!: Record<string, string> | null

  @ApiProperty({ description: 'Whether the template is active', type: Boolean, nullable: true })
  @ValidateIf((_, value) => value !== null)
  @IsBoolean({ message: 'O campo ativo deve ser um booleano.' })
  isActive!: boolean | null

  @ApiProperty({ description: 'Notification type id', type: String, nullable: true })
  @ValidateIf((_, value) => value !== null)
  @IsString({ message: 'O ID do tipo de notificação deve ser um texto.' })
  notificationTypeId!: string | null
}
