import { InsuranceCompany } from "@/modules/insurance-company/entities/insurance-company";
import { ProductType } from "@/modules/product-type/entities/product-type";

export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly productTypeId: string,
    public readonly insuranceCompanyId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
    public readonly productType?: ProductType,
    public readonly insuranceCompany?: InsuranceCompany,
  ) {}

  isActive(): boolean {
    return this.deletedAt === null
  }
}
