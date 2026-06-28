import { type EntityWithName } from "@/shared/models/entity"
import { type InsuranceCompany } from "@/features/InsuranceCompanyCrud/models/insurance-company"
import { type ProductType } from "@/features/ProductTypeCrud/models/product-type"

export interface Product extends EntityWithName {
  productTypeId: string
  insuranceCompanyId: string
  // Assumindo que a rota GET /products do backend popule essas relações.
  // Se não popular, a tabela usará apenas os IDs.
  productType?: ProductType
  insuranceCompany?: InsuranceCompany
}

export function formatProductLabel(
  product: Pick<Product, "name" | "insuranceCompanyId" | "insuranceCompany">,
) {
  return `${product.name} - ${
    product.insuranceCompany?.name ?? product.insuranceCompanyId
  }`
}

export type ProductUpsertPayload = Pick<
  Product,
  "name" | "productTypeId" | "insuranceCompanyId"
>
