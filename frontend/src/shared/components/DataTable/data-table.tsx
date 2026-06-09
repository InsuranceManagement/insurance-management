"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { useState } from "react"

import { Box } from "@/shared/components/ui/box"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Input } from "@/shared/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { cn } from "@/shared/lib/utils"

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  rowSelection: RowSelectionState
  setRowSelection: OnChangeFn<RowSelectionState>
  caption?: string
  emptyMessage?: string
  className?: string
  searchPlaceholder?: string
}

function DataTable<TData, TValue>({
  columns,
  data,
  rowSelection,
  setRowSelection,
  caption,
  emptyMessage = "Sem dados para exibir.",
  className,
  searchPlaceholder = "Buscar em todas as colunas...",
}: Readonly<DataTableProps<TData, TValue>>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    enableSortingRemoval: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
  })

  return (
    <Box className={cn("flex-col rounded-xl border bg-card", className)}>
      <Box className="border-b p-4">
        <Input
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder={searchPlaceholder}
          className="max-w-md"
        />
      </Box>

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
                  className={cn(
                    "text-xs font-semibold tracking-wide uppercase text-muted-foreground",
                    header.column.getCanSort() && "cursor-pointer select-none",
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <Box className="items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}

                      {header.column.getIsSorted() === "asc"
                        ? <ChevronUpIcon className="size-3" />
                        : header.column.getIsSorted() === "desc"
                          ? <ChevronDownIcon className="size-3" />
                          : null}
                    </Box>
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
