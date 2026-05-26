export interface CreateAddressInput {
  cep?: string
  street: string
  district: string
  state: string
  city: string
  number: string
  complement?: string
}
