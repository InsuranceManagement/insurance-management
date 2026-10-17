"use client"

import { useQueryClient } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { useMemo, useState } from "react"

import { ClientForm } from "@/features/ClientCrud/components/form"
import { type ClientUpsertFormValues } from "@/features/schema"
import { type Lead } from "@/features/LeadCrud/models/lead"
import { type EntityViewField } from "@/shared/components/CrudScreen/components/EntityViewModal"
import { CrudScreen } from "@/shared/components/CrudScreen/crud-screen"
import { Button } from "@/shared/components/ui/button"
import { Modal } from "@/shared/components/ui/modal"
import { Typography } from "@/shared/components/ui/typography"
import { routes } from "@/shared/constants/routes"
import { useApiMutation } from "@/shared/hooks/use-api-mutation"
import { formatDate } from "@/shared/lib/date-format"

const createColumns = (onConvert: (lead: Lead) => void): ColumnDef<Lead>[] => [
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
    id: "convert",
    header: "Ação",
    cell: ({ row }) => (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={(event) => {
          event.stopPropagation()
          onConvert(row.original)
        }}
      >
        Converter em cliente
      </Button>
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
]

export default function LeadCrud() {
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null)
  const columns = useMemo(() => createColumns(setLeadToConvert), [])
  const leadInitialValues = useMemo(
    () =>
      leadToConvert
        ? { name: leadToConvert.name, phoneNumber: leadToConvert.phoneNumber }
        : undefined,
    [leadToConvert],
  )
  const queryClient = useQueryClient()
  const convertMutation = useApiMutation<
    unknown,
    Omit<ClientUpsertFormValues, "name" | "phoneNumber">
  >({
    route: routes.leads.convertById,
    queryKeyToSync: ["crud-screen", "GET", "/leads"],
    meta: { successMessage: "Lead convertido em cliente com sucesso." },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["crud-screen", "GET", "/clients"],
      })
      setLeadToConvert(null)
    },
  })

  const handleConvert = (values: ClientUpsertFormValues) => {
    if (!leadToConvert) return
    const body = {
      email: values.email,
      cpf: values.cpf,
      cnpj: values.cnpj,
      birthDate: values.birthDate,
      address: values.address,
      productIds: values.productIds,
    }
    convertMutation.mutate({ routeParams: [leadToConvert.id], body })
  }

  return (
    <>
      <CrudScreen<Lead>
        title="Leads"
        columns={columns}
        inlineRowActions
        mobileCard={{
          titleColumnId: "name",
          hiddenColumnIds: ["createdAt"],
        }}
        viewModalTitle="Detalhes do Lead"
        viewFields={viewFields}
        renderViewActions={(lead, closeView) => (
          <Button
            type="button"
            onClick={() => {
              closeView()
              setLeadToConvert(lead)
            }}
          >
            Converter em cliente
          </Button>
        )}
        caption="Tabela de leads"
        sourceRoutes={{
          list: routes.leads.list,
          delete: routes.leads.deleteMany,
        }}
      />
      <Modal
        open={!!leadToConvert}
        onOpenChange={(open) => {
          if (!open) setLeadToConvert(null)
        }}
        title="Converter lead em cliente"
        contentClassName="sm:max-w-3xl"
        mobileFullscreen
      >
        {leadToConvert ? (
          <ClientForm
            key={leadToConvert.id}
            initialValues={leadInitialValues}
            lockLeadFields
            onSubmit={handleConvert}
            onCancel={() => setLeadToConvert(null)}
            submitLabel="Criar cliente"
            isSubmitting={convertMutation.isPending}
          />
        ) : null}
      </Modal>
    </>
  )
}
