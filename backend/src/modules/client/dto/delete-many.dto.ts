import { ApiProperty } from '@nestjs/swagger'
import { ArrayNotEmpty, ArrayUnique, IsArray, IsString } from 'class-validator'

export class DeleteManyDto {
  @ApiProperty({ description: 'Ids to delete', type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  ids!: string[]
}
