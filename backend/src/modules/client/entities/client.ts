export type ClientProduct = {
  id: string
  name: string
  productTypeId: string
  insuranceCompanyId: string
  createdAt: Date
  updatedAt: Date
}

export class Client {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly cpf: string,
    public readonly cnpj: string,
    public readonly phoneNumber: string,
    public readonly birthDate: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
    public readonly products: ClientProduct[] = [],
  ) {}

  isActive(): boolean {
    return this.deletedAt === null
  }
}
