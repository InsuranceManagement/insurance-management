import { SendClientEmailInput } from '@/modules/client/inputs/send-client-email.input'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator'

export class SendClientEmailDto implements SendClientEmailInput {
  @ApiPropertyOptional({ description: 'Notification template id' })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @ValidateIf((_, value: unknown) => value !== undefined && value !== null && value !== '')
  @IsString({ message: 'O ID do template deve ser um texto.' })
  @IsNotEmpty({ message: 'Informe um template válido.' })
  @MaxLength(120, { message: 'O ID do template deve ter no máximo 120 caracteres.' })
  templateId?: string

  @ApiPropertyOptional({ description: 'Custom email subject' })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @ValidateIf((obj: SendClientEmailDto) => !obj.templateId)
  @IsString({ message: 'O assunto deve ser um texto.' })
  @IsNotEmpty({ message: 'O assunto é obrigatório.' })
  @MaxLength(200, { message: 'O assunto deve ter no máximo 200 caracteres.' })
  subject?: string

  @ApiPropertyOptional({ description: 'Custom email message' })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @ValidateIf((obj: SendClientEmailDto) => !obj.templateId)
  @IsString({ message: 'A mensagem deve ser um texto.' })
  @IsNotEmpty({ message: 'A mensagem é obrigatória.' })
  @MaxLength(5000, { message: 'A mensagem deve ter no máximo 5000 caracteres.' })
  message?: string
}
