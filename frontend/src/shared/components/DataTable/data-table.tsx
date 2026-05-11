"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type OnChangeFn,
  type RowSelectionState,
  useReactTable,
} from "@tanstack/react-table"

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
import { Box } from "@/shared/components/ui/box"
import { cn } from "@/shared/lib/utils"

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  rowSelection: RowSelectionState
  setRowSelection: OnChangeFn<RowSelectionState>
  caption?: string
  emptyMessage?: string
  className?: string
}

function DataTable<TData, TValue>({
  columns,
  data,
  rowSelection,
  setRowSelection,
  caption,
  emptyMessage = "Sem dados para exibir.",
  className,
}: Readonly<DataTableProps<TData, TValue>>) {
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

  return (
    <Box className={cn("flex-col rounded-xl border bg-card", className)}>
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
