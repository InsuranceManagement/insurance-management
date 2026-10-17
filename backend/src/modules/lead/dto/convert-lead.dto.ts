import { CreateClientDto } from '@/modules/client/dto/create-client.dto'
import { CreateAddressDto } from '@/modules/client/dto/adress/create-address.dto'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDefined, ValidateNested } from 'class-validator'

export class ConvertLeadDto extends OmitType(CreateClientDto, ['name', 'phoneNumber'] as const) {
  @ApiProperty({ type: CreateAddressDto })
  @IsDefined({ message: 'Informe o endereço do cliente.' })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address!: CreateAddressDto
}
