import { CreateLeadInput } from '@/modules/lead/inputs/create-lead.input'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class CreateLeadDto implements CreateLeadInput {
  @ApiProperty({ description: 'Lead name' })
  @IsString({ message: 'O nome do lead deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome do lead é obrigatório.' })
  name!: string

  @ApiProperty({ description: 'Lead phone number' })
  @IsString({ message: 'O telefone deve ser um texto.' })
  @Matches(/^\d{10,15}$/, {
    message: 'O telefone deve conter entre 10 e 15 números. (somente números)',
  })
  phoneNumber!: string
}
