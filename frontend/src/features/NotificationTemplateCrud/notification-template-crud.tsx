"use client"

import { type ColumnDef } from "@tanstack/react-table"

import { NotificationTemplateForm } from "@/features/NotificationTemplateCrud/components/form"
import {
  type NotificationTemplate,
  type NotificationTemplateUpsertPayload,
} from "@/features/NotificationTemplateCrud/models/notification-template"
import { type EntityViewField } from "@/shared/components/CrudScreen/components/EntityViewModal"
import { CrudScreen } from "@/shared/components/CrudScreen/crud-screen"
import { Box } from "@/shared/components/ui/box"
import { Typography } from "@/shared/components/ui/typography"
import { routes } from "@/shared/constants/routes"
import { formatDate } from "@/shared/lib/date-format"

const columns: ColumnDef<NotificationTemplate>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "subject",
    header: "Assunto",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Typography variant="small">
        {row.original.isActive ? "Ativo" : "Inativo"}
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

const viewFields: EntityViewField<NotificationTemplate>[] = [
  { accessorKey: "name", label: "Nome" },
  { accessorKey: "description", label: "Descrição" },
  { accessorKey: "subject", label: "Assunto" },
  {
    accessorKey: "isActive",
    label: "Status",
    cell: ({ entity }) => (
      <Typography variant="small">
        {entity.isActive ? "Ativo" : "Inativo"}
      </Typography>
    ),
  },
  { accessorKey: "notificationTypeId", label: "ID do tipo de notificação" },
  {
    accessorKey: "variableSchema",
    label: "Variáveis",
    cell: ({ entity }) => (
      <Box asChild>
        <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">
          {JSON.stringify(entity.variableSchema ?? {}, null, 2)}
        </pre>
      </Box>
    ),
  },
  {
    accessorKey: "body",
    label: "Corpo (HTML)",
    cell: ({ entity }) => (
      <Box asChild>
        <pre className="max-h-64 overflow-auto rounded-md bg-muted p-3 text-xs whitespace-pre-wrap">
          {entity.body}
        </pre>
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
]

export default function NotificationTemplateCrud() {
  return (
    <CrudScreen<NotificationTemplate, NotificationTemplateUpsertPayload>
      title="Templates de mensagem"
      listQueryKey={["notification-templates"]}
      columns={columns}
      createForm={NotificationTemplateForm}
      createFormTitle="Novo template"
      editFormTitle="Editar template"
      formModalContentClassName="sm:max-w-2xl"
      viewFields={viewFields}
      viewModalTitle="Detalhes do template"
      caption="Tabela de templates de mensagem"
      mapEditEntityToFormValues={(entity) => ({
        name: entity.name,
        description: entity.description,
        subject: entity.subject,
        body: entity.body,
        variableSchema: entity.variableSchema,
        isActive: entity.isActive,
        notificationTypeId: entity.notificationTypeId,
      })}
      sourceRoutes={{
        list: routes.notifications.templates,
        create: routes.notifications.createTemplate,
        edit: routes.notifications.updateTemplateById,
      }}
    />
  )
}
