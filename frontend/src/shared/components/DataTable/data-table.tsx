"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type RowSelectionState,
  useReactTable,
} from "@tanstack/react-table"
import { PencilIcon, Trash2Icon, XIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { Typography } from "@/shared/components/ui/typography"
import { Box } from "@/shared/components/ui/box"
import { cn } from "@/shared/lib/utils"

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  caption?: string
  emptyMessage?: string
  className?: string
  onRowSelectionChange?: (selectedRows: TData[]) => void
  onDeleteSelected?: (selectedRows: TData[]) => void
  onEditSelected?: (selectedRow: TData) => void
}

function DataTable<TData, TValue>({
  columns,
  data,
  caption,
  emptyMessage = "Sem dados para exibir.",
  className,
  onRowSelectionChange,
  onDeleteSelected,
  onEditSelected,
}: Readonly<DataTableProps<TData, TValue>>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })

  useEffect(() => {
    if (!onRowSelectionChange) {
      return
    }

    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((selectedRow) => selectedRow.original)

    onRowSelectionChange(selectedRows)
  }, [onRowSelectionChange, rowSelection, table])

  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((selectedRow) => selectedRow.original)

  const selectedCount = selectedRows.length
  const isSingleSelection = selectedCount === 1

  const handleDeleteSelected = () => {
    if (!onDeleteSelected || selectedCount === 0) {
      return
    }

    onDeleteSelected(selectedRows)
    table.resetRowSelection()
  }

  const handleEditSelected = () => {
    if (!onEditSelected || !isSingleSelection) {
      return
    }

    onEditSelected(selectedRows[0])
  }

  return (
    <Box
      className={cn("relative flex-col rounded-xl border bg-card", className)}
    >
      {selectedCount > 0 ? (
        <Box className="absolute -top-12 right-3 z-10 items-center gap-2 rounded-lg border bg-card p-2 shadow-sm">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Limpar selecao"
            onClick={() => table.resetRowSelection()}
          >
            <XIcon />
          </Button>

          <Typography variant="small" className="text-muted-foreground">
            {selectedCount} itens selecionados
          </Typography>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Deletar selecionados"
            onClick={handleDeleteSelected}
          >
            <Trash2Icon className="text-destructive" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Editar selecionado"
            aria-pressed={isSingleSelection}
            disabled={!isSingleSelection}
            className={cn(isSingleSelection ? "bg-muted text-foreground" : "")}
            onClick={handleEditSelected}
          >
            <PencilIcon
              className={cn(
                isSingleSelection ? "text-foreground" : "text-muted-foreground",
              )}
            />
          </Button>
        </Box>
      ) : null}

      <Table>
        {caption ? (
          <TableCaption className="sr-only">{caption}</TableCaption>
        ) : null}

        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-muted/60 hover:bg-muted/60"
            >
              <TableHead className="w-10 px-2 text-center">
                <Checkbox
                  aria-label="Selecionar todos"
                  checked={!!table.getIsAllPageRowsSelected()}
                  onCheckedChange={(checked) =>
                    table.toggleAllPageRowsSelected(checked === true)
                  }
                />
              </TableHead>

              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="cursor-pointer"
                onClick={row.getToggleSelectedHandler()}
              >
                <TableCell
                  className="w-10 px-2 text-center"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Checkbox
                    aria-label="Selecionar linha"
                    checked={row.getIsSelected()}
                    onCheckedChange={(checked) =>
                      row.toggleSelected(checked === true)
                    }
                  />
                </TableCell>

                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="h-20 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  )
}

export { DataTable, type DataTableProps }
