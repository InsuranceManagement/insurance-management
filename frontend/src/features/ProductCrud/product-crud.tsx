"use client"

import { type ColumnDef } from "@tanstack/react-table"

import { ProductForm } from "@/features/ProductCrud/components/form"
import { type Product } from "@/features/ProductCrud/models/product"
import { type ProductUpsertFormValues } from "@/features/schema"
import { type EntityViewField } from "@/shared/components/CrudScreen/components/EntityViewModal"
import { CrudScreen } from "@/shared/components/CrudScreen/crud-screen"
import { Typography } from "@/shared/components/ui/typography"
import { routes } from "@/shared/constants/routes"
import { formatDate } from "@/shared/lib/date-format"

const columns: ColumnDef<Product>[] = [
  { accessorKey: "name", header: "Nome do Produto" },
  {
    accessorKey: "productTypeId",
    header: "Tipo",
    cell: ({ row }) => (
      <Typography asChild variant="small">
        <span>
          {row.original.productType?.name ?? row.original.productTypeId}
        </span>
      </Typography>
    ),
  },
  {
    accessorKey: "insuranceCompanyId",
    header: "Seguradora",
    cell: ({ row }) => (
      <Typography asChild variant="small">
        <span>
          {row.original.insuranceCompany?.name ??
            row.original.insuranceCompanyId}
        </span>
      </Typography>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => (
      <Typography asChild variant="small">
        <span>{formatDate(row.original.createdAt, "DD/MM/YYYY")}</span>
      </Typography>
    ),
  },
]

const viewFields: EntityViewField<Product>[] = [
  { accessorKey: "name", label: "Nome" },
  {
    accessorKey: "productTypeId",
    label: "Tipo",
    cell: ({ entity }) => (
      <Typography asChild variant="small">
        <span>{entity?.productType?.name ?? entity?.productTypeId}</span>
      </Typography>
    ),
  },
  {
    accessorKey: "insuranceCompanyId",
    label: "Seguradora",
    cell: ({ entity }) => (
      <Typography asChild variant="small">
        <span>
          {entity?.insuranceCompany?.name ?? entity?.insuranceCompanyId}
        </span>
      </Typography>
    ),
  },
  {
    accessorKey: "createdAt",
    label: "Criado em",
    cell: ({ value }) => (
      <Typography asChild variant="small">
        <span>{formatDate(String(value), "DD/MM/YYYY HH:mm")}</span>
      </Typography>
    ),
  },
]

export default function ProductCrud() {
  return (
    <CrudScreen<Product, ProductUpsertFormValues>
      title="Produtos"
      columns={columns}
      createForm={ProductForm}
      createFormTitle="Novo produto"
      editFormTitle="Editar produto"
      viewModalTitle="Detalhes do Produto"
      viewModalSubtitle={(entity) => `#Id ${entity.id}`}
      viewFields={viewFields}
      mapEditEntityToFormValues={(entity) => ({
        name: entity.name,
        productTypeId: entity.productTypeId,
        insuranceCompanyId: entity.insuranceCompanyId,
      })}
      caption="Catálogo de produtos"
      sourceRoutes={{
        list: routes.products.list,
        create: routes.products.create,
        edit: routes.products.updateById,
        delete: routes.products.deleteById,
      }}
    />
  )
}
