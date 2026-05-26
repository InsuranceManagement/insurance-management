import { CreateAddressInput } from './address/create-address.input'

export interface CreateClientInput {
  name: string
  email: string
  cpf?: string
  cnpj?: string
  phoneNumber: string
  birthDate: string
  address: CreateAddressInput
  productIds?: string[]
}
