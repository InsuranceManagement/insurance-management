import { type Entity, type EntityWithName } from "@/shared/models/entity"

export interface ClientAddress extends Entity {
  cep?: string
  street: string
  district: string
  state: string
  city: string
  number: string
  complement?: string
}

export interface ClientProduct extends EntityWithName {
  productTypeId: string
  insuranceCompanyId: string
}

export interface Client extends EntityWithName {
  email: string
  cpf?: string
  cnpj?: string
  phoneNumber: string
  birthDate: string
  address: ClientAddress
  products: ClientProduct[]
}
