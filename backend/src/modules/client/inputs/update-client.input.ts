import { UpdateAddressInput } from './address/update-address.input'
import { CreateClientInput } from './create-client.input'

export interface UpdateClientInput extends Partial<Omit<CreateClientInput, 'address'>> {
  address?: UpdateAddressInput
}
