"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { ProductTypeForm } from "@/features/ProductTypeCrud/components/form";
import { type ProductType } from "@/features/ProductTypeCrud/models/product-type";
import { type ProductTypeUpsertFormValues } from "@/features/schema";
import { type EntityViewField } from "@/shared/components/CrudScreen/components/EntityViewModal";
import { CrudScreen } from "@/shared/components/CrudScreen/crud-screen";
import { Typography } from "@/shared/components/ui/typography";
import { routes } from "@/shared/constants/routes";
import { formatDate } from "@/shared/lib/date-format";

const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "description",
    header: "Descrição",
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
];

const viewFields: EntityViewField<ProductType>[] = [
  {
    accessorKey: "name",
    label: "Nome",
  },
  {
    accessorKey: "description",
    label: "Descrição",
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
];

export default function ProductTypeCrud() {
  return (
    <CrudScreen<ProductType, ProductTypeUpsertFormValues>
      title="Tipos de Produto"
      columns={columns}
      createForm={ProductTypeForm}
      createFormTitle="Novo tipo de produto"
      editFormTitle="Editar tipo de produto"
      viewModalTitle="Detalhes do Tipo de Produto"
      viewModalSubtitle={(entity) => `#Id ${entity.id}`}
      viewFields={viewFields}
      mapEditEntityToFormValues={(entity) => ({
        name: entity.name,
        description: entity.description,
      })}
      caption="Tabela de tipos de produto"
      sourceRoutes={{
        list: routes.productTypes.list,
        create: routes.productTypes.create,
        edit: routes.productTypes.updateById,
        delete: routes.productTypes.deleteById,
      }}
    />
  );
}
