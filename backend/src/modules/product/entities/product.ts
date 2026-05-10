export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly productTypeId: string,
    public readonly insuranceCompanyId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}

  isActive(): boolean {
    return this.deletedAt === null
  }
}
