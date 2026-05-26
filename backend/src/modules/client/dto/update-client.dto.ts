import { UpdateClientInput } from '@/modules/client/inputs/update-client.input'
import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'
import { UpdateAddressDto } from './adress/update-address.dto'
import { CreateClientDto } from './create-client.dto'

class UpdateClientBaseDto extends PartialType(OmitType(CreateClientDto, ['address'] as const)) {}

export class UpdateClientDto extends UpdateClientBaseDto implements UpdateClientInput {
  @ApiPropertyOptional({ type: UpdateAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAddressDto)
  address?: UpdateAddressDto
}
