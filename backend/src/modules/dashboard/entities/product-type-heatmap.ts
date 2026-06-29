import type { InsuranceCompanyGetPayload } from '@generated/prisma/models/InsuranceCompany'
import type { ProductTypeModel } from '@generated/prisma/models/ProductType'

export type InsuranceCompanyWithProductTypesRecord = InsuranceCompanyGetPayload<{
  select: {
    id: true
    name: true
    color: true
    products: {
      select: {
        productType: {
          select: {
            id: true
            name: true
          }
        }
      }
    }
  }
}>

export class ProductTypeHeatmapCompany {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly color: string,
  ) {}
}

export class ProductTypeHeatmapProductType {
  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {}
}

export class ProductTypeHeatmapCell {
  constructor(
    public readonly insuranceCompanyId: string,
    public readonly productTypeId: string,
    public readonly value: number,
    public readonly productCount: number,
  ) {}
}

export class ProductTypeHeatmapRowProductType {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly productCount: number,
  ) {}
}

export class ProductTypeHeatmapRow {
  constructor(
    public readonly insuranceCompanyId: string,
    public readonly insuranceCompanyName: string,
    public readonly color: string,
    public readonly productTypes: ProductTypeHeatmapRowProductType[],
  ) {}
}

export class ProductTypeHeatmap {
  constructor(
    public readonly insuranceCompanies: ProductTypeHeatmapCompany[],
    public readonly productTypes: ProductTypeHeatmapProductType[],
    public readonly cells: ProductTypeHeatmapCell[],
    public readonly rows: ProductTypeHeatmapRow[],
  ) {}

  static fromPrisma(
    companies: InsuranceCompanyWithProductTypesRecord[],
    productTypes: Pick<ProductTypeModel, 'id' | 'name'>[],
  ): ProductTypeHeatmap {
    const heatmapCompanies = companies.map(
      (company) => new ProductTypeHeatmapCompany(company.id, company.name, company.color),
    )

    const heatmapProductTypes = productTypes.map(
      (productType) => new ProductTypeHeatmapProductType(productType.id, productType.name),
    )

    const productCountsByCompany = new Map<string, Map<string, number>>()

    companies.forEach((company) => {
      const productTypeCounts = new Map<string, number>()

      company.products.forEach((product) => {
        const currentCount = productTypeCounts.get(product.productType.id) ?? 0
        productTypeCounts.set(product.productType.id, currentCount + 1)
      })

      productCountsByCompany.set(company.id, productTypeCounts)
    })

    const cells = companies.flatMap((company) => {
      const productTypeCounts = productCountsByCompany.get(company.id) ?? new Map<string, number>()

      return productTypes.map((productType) => {
        const productCount = productTypeCounts.get(productType.id) ?? 0

        return new ProductTypeHeatmapCell(
          company.id,
          productType.id,
          productCount > 0 ? 1 : 0,
          productCount,
        )
      })
    })

    const rows = companies.map((company) => {
      const productTypeCounts = productCountsByCompany.get(company.id) ?? new Map<string, number>()
      const companyProductTypes = productTypes
        .map((productType) => {
          const productCount = productTypeCounts.get(productType.id) ?? 0

          return new ProductTypeHeatmapRowProductType(
            productType.id,
            productType.name,
            productCount,
          )
        })
        .filter((productType) => productType.productCount > 0)

      return new ProductTypeHeatmapRow(company.id, company.name, company.color, companyProductTypes)
    })

    return new ProductTypeHeatmap(heatmapCompanies, heatmapProductTypes, cells, rows)
  }
}
