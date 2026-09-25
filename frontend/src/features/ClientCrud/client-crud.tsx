"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

import { ClientForm } from "@/features/ClientCrud/components/form"
import { type Client } from "@/features/ClientCrud/models/client"
import {
  formatProductLabel,
  type Product,
} from "@/features/ProductCrud/models/product"
import { type ClientUpsertFormValues } from "@/features/schema"
import { type EntityViewField } from "@/shared/components/CrudScreen/components/EntityViewModal"
import { CrudScreen } from "@/shared/components/CrudScreen/crud-screen"
import { useListEntity } from "@/shared/components/CrudScreen/hooks/use-list-entity"
import { Box } from "@/shared/components/ui/box"
import { Typography } from "@/shared/components/ui/typography"
import { routes } from "@/shared/constants/routes"
import { formatDate } from "@/shared/lib/date-format"

function getDocumentLabel(client: Client) {
  return client.cpf ?? client.cnpj ?? "-"
}

const clientAvatarColors = [
  { background: "#dbeafe", foreground: "#1e3a8a" },
  { background: "#dcfce7", foreground: "#166534" },
  { background: "#fef3c7", foreground: "#92400e" },
  { background: "#fce7f3", foreground: "#9d174d" },
  { background: "#ede9fe", foreground: "#5b21b6" },
  { background: "#ffedd5", foreground: "#9a3412" },
]

function getClientInitials(name: string) {
  const nameParts = name.trim().split(/\s+/).filter(Boolean)

  if (nameParts.length === 0) return "?"
  if (nameParts.length === 1) return nameParts[0].slice(0, 2).toUpperCase()

  return `${nameParts[0][0]}${nameParts.at(-1)?.[0] ?? ""}`.toUpperCase()
}

function getClientAvatarColor(name: string) {
  const hash = [...name].reduce((total, character) => total + character.charCodeAt(0), 0)
  return clientAvatarColors[hash % clientAvatarColors.length]
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
    cell: ({ row }) => {
      const avatarColor = getClientAvatarColor(row.original.name)

      return (
        <Box className="min-w-0 items-center gap-3">
          <Box
            aria-hidden="true"
            className="size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            style={{
              backgroundColor: avatarColor.background,
              color: avatarColor.foreground,
            }}
          >
            {getClientInitials(row.original.name)}
          </Box>
          <span className="min-w-0 break-words [overflow-wrap:anywhere]">
            {row.original.name}
          </span>
        </Box>
      )
    },
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

const createViewFields = (
  productLabelsById: ReadonlyMap<string, string>,
): EntityViewField<Client>[] => [
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
    label: "Endereço",
    className: "sm:col-span-2",
    cell: ({ entity }) => (
      <Typography asChild variant="small">
        <span>{formatAddress(entity)}</span>
      </Typography>
    ),
  },
  {
    accessorKey: "products",
    label: "Produtos",
    className: "sm:col-span-2",
    cell: ({ entity }) => (
      <Box className="flex-col gap-1">
        {entity.products.length > 0 ? (
          entity.products.map((product) => (
            <Typography key={product.id} asChild variant="small">
              <span>{productLabelsById.get(product.id) ?? product.name}</span>
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
  const { rows: products } = useListEntity<Product>({
    title: "Produtos",
    listRoute: routes.products.list,
  })

  const viewFields = useMemo(() => {
    const productLabelsById = new Map(
      products.map((product) => [product.id, formatProductLabel(product)]),
    )

    return createViewFields(productLabelsById)
  }, [products])

  return (
    <CrudScreen<Client, ClientUpsertFormValues>
      title="Clientes"
      columns={columns}
      inlineRowActions
      mobileCard={{
        titleColumnId: "name",
        hiddenColumnIds: ["email", "cpf", "createdAt"],
        tabletHiddenColumnIds: ["cpf"],
      }}
      createForm={ClientForm}
      createFormTitle="Novo cliente"
      editFormTitle="Editar cliente"
      formModalContentClassName="sm:max-w-3xl"
      viewModalTitle="Detalhes do Cliente"
      viewModalContentClassName="sm:max-w-3xl"
      viewModalExpandable
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
