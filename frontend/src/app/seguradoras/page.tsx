"use client"

import { useState } from "react"

import { Box } from "@/shared/components/ui/box"
import { type ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/shared/components/DataTable/data-table"
import { Typography } from "@/shared/components/ui/typography"

type SeguradoraActivity = {
  id: string
  dataHora: string
  evento: string
  cliente: string
  valor: string
  status: "Ativa" | "Em Analise" | "Inativa"
}

const mockActivities: SeguradoraActivity[] = [
  {
    id: "evt-44512",
    dataHora: "02/12/2023 07:30",
    evento: "Nova Apolice Criada #A4512",
    cliente: "Joao Silva",
    valor: "R$ 1.200",
    status: "Ativa",
  },
  {
    id: "evt-7823-a",
    dataHora: "02/12/2023 07:30",
    evento: "Sinistro Registrado #S7823",
    cliente: "Maria Costa",
    valor: "R$ 3.500",
    status: "Em Analise",
  },
  {
    id: "evt-7823-b",
    dataHora: "02/12/2023 07:30",
    evento: "Sinistro Registrado #S7823",
    cliente: "Maria Costa",
    valor: "R$ 3.500",
    status: "Em Analise",
  },
  {
    id: "evt-44512-b",
    dataHora: "02/12/2023 07:30",
    evento: "Nova Apolice Criada #A4512",
    cliente: "Joao Silva",
    valor: "R$ 1.200",
    status: "Ativa",
  },
  {
    id: "evt-7823-c",
    dataHora: "02/12/2023 07:30",
    evento: "Sinistro Registrado #S7823",
    cliente: "Maria Costa",
    valor: "R$ 1.200",
    status: "Ativa",
  },
]

const statusClasses: Record<SeguradoraActivity["status"], string> = {
  Ativa: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "Em Analise":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Inativa: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
}

const columns: ColumnDef<SeguradoraActivity>[] = [
  {
    accessorKey: "dataHora",
    header: "Data/Hora",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.original.dataHora}</span>
    ),
  },
  {
    accessorKey: "evento",
    header: "Evento",
  },
  {
    accessorKey: "cliente",
    header: "Cliente",
  },
  {
    accessorKey: "valor",
    header: "Valor",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Typography
        asChild
        variant="small"
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusClasses[row.original.status]}`}
      >
        <span>{row.original.status}</span>
      </Typography>
    ),
  },
]

export default function SeguradorasPage() {
  const [activities, setActivities] = useState(mockActivities)
  const [editingActivity, setEditingActivity] =
    useState<SeguradoraActivity | null>(null)

  const handleDeleteSelected = (selectedRows: SeguradoraActivity[]) => {
    const selectedIds = new Set(selectedRows.map((row) => row.id))

    setActivities((currentActivities) =>
      currentActivities.filter((activity) => !selectedIds.has(activity.id)),
    )

    if (editingActivity && selectedIds.has(editingActivity.id)) {
      setEditingActivity(null)
    }
  }

  const handleEditSelected = (selectedRow: SeguradoraActivity) => {
    setEditingActivity(selectedRow)
  }

  return (
    <main className="flex flex-1 flex-col p-6 md:p-8">
      <Box className="flex-col gap-4">
        <Typography variant="h3">Atividade Recente</Typography>

        <DataTable
          caption="Tabela de atividades recentes"
          columns={columns}
          data={activities}
          onDeleteSelected={handleDeleteSelected}
          onEditSelected={handleEditSelected}
        />
      </Box>
    </main>
  )
}
