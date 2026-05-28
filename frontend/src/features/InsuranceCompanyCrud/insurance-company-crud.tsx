"use client"
import { type ColumnDef } from "@tanstack/react-table"

import { InsuranceCompanyForm } from "@/features/InsuranceCompanyCrud/components/form"
import { type InsuranceCompany } from "@/features/InsuranceCompanyCrud/models/insurance-company"
import { type InsuranceCompanyUpsertFormValues } from "@/features/schema"
import { type EntityViewField } from "@/shared/components/CrudScreen/components/EntityViewModal"
import { CrudScreen } from "@/shared/components/CrudScreen/crud-screen"
import { Box } from "@/shared/components/ui/box"
import { Typography } from "@/shared/components/ui/typography"
import { routes } from "@/shared/constants/routes"
import { formatDate } from "@/shared/lib/date-format"

const columns: ColumnDef<InsuranceCompany>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "color",
    header: "Cor",
    cell: ({ row }) => (
      <Box className="items-center gap-2">
        <Box
          aria-hidden
          className="size-4 rounded-full border"
          style={{ backgroundColor: row.original.color }}
        />
        <Typography asChild variant="small">
          <span>{row.original.color}</span>
        </Typography>
      </Box>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => (
      <Typography asChild variant="small">
        <span>{formatDate(row.original.createdAt, "DD/MM/YYYY HH:mm")}</span>
      </Typography>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Atualizado em",
    cell: ({ row }) => (
      <Typography asChild variant="small">
        <span>{formatDate(row.original.updatedAt, "DD/MM/YYYY HH:mm")}</span>
      </Typography>
    ),
  },
]

const viewFields: EntityViewField<InsuranceCompany>[] = [
  {
    accessorKey: "name",
    label: "Nome",
  },
  {
    accessorKey: "color",
    label: "Cor",
    cell: ({ value }) => (
      <Box className="items-center gap-2">
        <Box
          aria-hidden
          className="size-4 rounded-full border"
          style={{ backgroundColor: String(value) }}
        />
        <Typography asChild variant="small">
          <span>{String(value)}</span>
        </Typography>
      </Box>
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
  {
    accessorKey: "updatedAt",
    label: "Atualizado em",
    cell: ({ value }) => (
      <Typography asChild variant="small">
        <span>{formatDate(String(value), "DD/MM/YYYY HH:mm")}</span>
      </Typography>
    ),
  },
]

export default function InsuranceCompanyCrud() {
  return (
    <CrudScreen<InsuranceCompany, InsuranceCompanyUpsertFormValues>
      title="Seguradoras"
      columns={columns}
      createForm={InsuranceCompanyForm}
      createFormTitle="Nova seguradora"
      editFormTitle="Editar seguradora"
      viewModalTitle="Detalhes da Seguradora"
      viewModalSubtitle={(entity) => `#Id ${entity.id}`}
      viewFields={viewFields}
      mapEditEntityToFormValues={(entity) => ({
        name: entity.name,
        color: entity.color,
      })}
      caption="Tabela de seguradoras"
      sourceRoutes={{
        list: routes.insuranceCompanies.list,
        create: routes.insuranceCompanies.create,
        edit: routes.insuranceCompanies.updateById,
        delete: routes.insuranceCompanies.deleteById,
      }}
    />
  )
}
