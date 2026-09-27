import { UpdateLeadInput } from '@/modules/lead/inputs/update-lead.input'
import { PartialType } from '@nestjs/swagger'
import { CreateLeadDto } from './create-lead.dto'

export class UpdateLeadDto extends PartialType(CreateLeadDto) implements UpdateLeadInput {}

