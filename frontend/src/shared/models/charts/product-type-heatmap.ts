export interface ProductTypeHeatmapCompany {
  id: string
  name: string
  color: string
}

export interface ProductTypeHeatmapProductType {
  id: string
  name: string
}

export interface ProductTypeHeatmapCell {
  insuranceCompanyId: string
  productTypeId: string
  value: number
  productCount: number
}

export interface ProductTypeHeatmapRowProductType {
  id: string
  name: string
  productCount: number
}

export interface ProductTypeHeatmapRow {
  insuranceCompanyId: string
  insuranceCompanyName: string
  color: string
  productTypes: ProductTypeHeatmapRowProductType[]
}

export interface ProductTypeHeatmapData {
  insuranceCompanies: ProductTypeHeatmapCompany[]
  productTypes: ProductTypeHeatmapProductType[]
  cells: ProductTypeHeatmapCell[]
  rows: ProductTypeHeatmapRow[]
}
