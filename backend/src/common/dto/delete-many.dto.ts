import { ApiProperty } from '@nestjs/swagger'
import { ArrayNotEmpty, ArrayUnique, IsArray, IsString } from 'class-validator'

export class DeleteManyDto {
  @ApiProperty({ description: 'Ids to delete', type: [String] })
  @IsArray({ message: 'Os IDs devem ser enviados em uma lista.' })
  @ArrayNotEmpty({ message: 'Informe pelo menos um ID para exclusão.' })
  @ArrayUnique({ message: 'A lista de IDs não pode conter valores duplicados.' })
  @IsString({ each: true, message: 'Cada ID deve ser um texto válido.' })
  ids!: string[]
}
