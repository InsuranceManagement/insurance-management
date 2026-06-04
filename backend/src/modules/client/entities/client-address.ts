export type ClientAddress = {
  id: string
  cep: string | null
  street: string
  district: string
  state: string
  city: string
  number: string
  complement: string | null
  createdAt: Date
  updatedAt: Date
}
