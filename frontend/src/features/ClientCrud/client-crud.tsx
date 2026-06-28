"use client"

import { type ColumnDef } from "@tanstack/react-table"

import { ClientForm } from "@/features/ClientCrud/components/form"
import { type Client } from "@/features/ClientCrud/models/client"
import { type ClientUpsertFormValues } from "@/features/schema"
import { type EntityViewField } from "@/shared/components/CrudScreen/components/EntityViewModal"
import { CrudScreen } from "@/shared/components/CrudScreen/crud-screen"
import { Box } from "@/shared/components/ui/box"
import { Typography } from "@/shared/components/ui/typography"
import { routes } from "@/shared/constants/routes"
import { formatDate } from "@/shared/lib/date-format"

function getDocumentLabel(client: Client) {
  return client.cpf ?? client.cnpj ?? "-"
}

function formatAddress(client: Client) {
  const { address } = client
  const addressLine = [
    address.street,
    address.number,
    address.district,
    address.city,
    address.state,
  ]
    .filter(Boolean)
    .join(", ")

  return [addressLine, address.cep ? `CEP ${address.cep}` : undefined]
    .filter(Boolean)
    .join(" - ")
}

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "E-mail",
  },
  {
    accessorKey: "cpf",
    header: "Documento",
    cell: ({ row }) => (
      <Typography asChild variant="small">
        <span>{getDocumentLabel(row.original)}</span>
      </Typography>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Telefone",
  },
  {
    accessorKey: "products",
    header: "Produtos",
    cell: ({ row }) => (
      <Typography asChild variant="small">
        <span>{row.original.products.length}</span>
      </Typography>
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
]

const viewFields: EntityViewField<Client>[] = [
  {
    accessorKey: "name",
    label: "Nome",
  },
  {
    accessorKey: "email",
    label: "E-mail",
  },
  {
    accessorKey: "cpf",
    label: "CPF",
  },
  {
    accessorKey: "cnpj",
    label: "CNPJ",
  },
  {
    accessorKey: "phoneNumber",
    label: "Telefone",
  },
  {
    accessorKey: "birthDate",
    label: "Nascimento",
    cell: ({ value }) => (
      <Typography asChild variant="small">
        <span>{formatDate(String(value), "DD/MM/YYYY")}</span>
      </Typography>
    ),
  },
  {
    accessorKey: "address",
    label: "Endereco",
    cell: ({ entity }) => (
      <Typography asChild variant="small">
        <span>{formatAddress(entity)}</span>
      </Typography>
    ),
  },
  {
    accessorKey: "products",
    label: "Produtos",
    cell: ({ entity }) => (
      <Box className="flex-col gap-1">
        {entity.products.length > 0 ? (
          entity.products.map((product) => (
            <Typography key={product.id} asChild variant="small">
              <span>{product.name}</span>
            </Typography>
          ))
        ) : (
          <Typography asChild variant="small">
            <span>Nenhum produto</span>
          </Typography>
        )}
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

export default function ClientCrud() {
  return (
    <CrudScreen<Client, ClientUpsertFormValues>
      title="Clientes"
      columns={columns}
      createForm={ClientForm}
      createFormTitle="Novo cliente"
      editFormTitle="Editar cliente"
      viewModalTitle="Detalhes do Cliente"
      viewModalSubtitle={(entity) => `#Id ${entity.id}`}
      viewFields={viewFields}
      mapEditEntityToFormValues={(entity) => ({
        name: entity.name,
        email: entity.email,
        cpf: entity.cpf ?? "",
        cnpj: entity.cnpj ?? "",
        phoneNumber: entity.phoneNumber,
        birthDate: formatDate(entity.birthDate, "YYYY-MM-DD", ""),
        address: {
          cep: entity.address.cep ?? "",
          street: entity.address.street,
          district: entity.address.district,
          state: entity.address.state,
          city: entity.address.city,
          number: entity.address.number,
          complement: entity.address.complement ?? "",
        },
        productIds: entity.products.map((product) => product.id),
      })}
      caption="Tabela de clientes"
      sourceRoutes={{
        list: routes.clients.list,
        create: routes.clients.create,
        edit: routes.clients.updateById,
        delete: routes.clients.deleteMany,
      }}
    />
  )
}
