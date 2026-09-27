"use client"

import { type ColumnDef } from "@tanstack/react-table"

import { LeadForm } from "@/features/LeadCrud/components/form"
import { type Lead } from "@/features/LeadCrud/models/lead"
import { type LeadUpsertFormValues } from "@/features/schema"
import { type EntityViewField } from "@/shared/components/CrudScreen/components/EntityViewModal"
import { CrudScreen } from "@/shared/components/CrudScreen/crud-screen"
import { Typography } from "@/shared/components/ui/typography"
import { routes } from "@/shared/constants/routes"
import { formatDate } from "@/shared/lib/date-format"

const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "phoneNumber",
    header: "Telefone",
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

const viewFields: EntityViewField<Lead>[] = [
  {
    accessorKey: "name",
    label: "Nome",
  },
  {
    accessorKey: "phoneNumber",
    label: "Telefone",
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

export default function LeadCrud() {
  return (
    <CrudScreen<Lead, LeadUpsertFormValues>
      title="Leads"
      columns={columns}
      inlineRowActions
      hideInlineViewActionOnDesktop
      mobileCard={{
        titleColumnId: "name",
        hiddenColumnIds: ["createdAt", "updatedAt"],
      }}
      createForm={LeadForm}
      createFormTitle="Novo lead"
      editFormTitle="Editar lead"
      viewModalTitle="Detalhes do Lead"
      viewFields={viewFields}
      mapEditEntityToFormValues={(entity) => ({
        name: entity.name,
        phoneNumber: entity.phoneNumber,
      })}
      caption="Tabela de leads"
      sourceRoutes={{
        list: routes.leads.list,
        create: routes.leads.create,
        edit: routes.leads.updateById,
        delete: routes.leads.deleteMany,
      }}
    />
  )
}

