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
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FileTextIcon,
  PencilIcon,
} from "lucide-react"
import { useState } from "react"

import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Input } from "@/shared/components/ui/input"
import { SelectInput } from "@/shared/components/ui/select-input"
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

type MobileCardConfig<TData> = {
  titleColumnId: Extract<keyof TData, string>
  hiddenColumnIds?: Extract<keyof TData, string>[]
  tabletHiddenColumnIds?: Extract<keyof TData, string>[]
  accentColor?: (entity: TData) => string | undefined
}

type RowActions<TData> = {
  onEdit: (entity: TData) => void
  onViewDetails: (entity: TData) => void
  hideViewOnDesktop?: boolean
}

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  rowSelection: RowSelectionState
  setRowSelection: OnChangeFn<RowSelectionState>
  caption?: string
  emptyMessage?: string
  className?: string
  searchPlaceholder?: string
  mobileCard: MobileCardConfig<TData>
  rowActions?: RowActions<TData>
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
  mobileCard,
  rowActions,
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

  const noSortValue = "__no_sort__"
  const activeSort = sorting[0]
  const sortableColumns = table
    .getAllLeafColumns()
    .filter(
      (column) =>
        column.getCanSort() && typeof column.columnDef.header === "string",
    )
  const hiddenMobileColumns = new Set<string>(
    mobileCard.hiddenColumnIds ?? [],
  )
  const hiddenTabletColumns = new Set<string>(
    mobileCard.tabletHiddenColumnIds ?? [],
  )
  const hasRowActions = !!rowActions

  const renderRowActions = (entity: TData) => {
    if (!rowActions) return null

    return (
      <Box className="shrink-0 items-center gap-1 max-md:-translate-y-0.5 md:w-full md:justify-end md:gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-9 md:size-7"
          aria-label="Editar registro"
          onClick={() => rowActions.onEdit(entity)}
        >
          <PencilIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={cn(
            "size-9 md:size-7",
            rowActions.hideViewOnDesktop && "lg:hidden",
          )}
          aria-label="Ver detalhes do registro"
          onClick={() => rowActions.onViewDetails(entity)}
        >
          <FileTextIcon className="size-4" />
        </Button>
      </Box>
    )
  }

  const handleMobileSortChange = (columnId: string) => {
    if (columnId === noSortValue) {
      setSorting([])
      return
    }

    setSorting([{ id: columnId, desc: false }])
  }

  const toggleMobileSortDirection = () => {
    if (!activeSort) return
    setSorting([{ ...activeSort, desc: !activeSort.desc }])
  }

  return (
    <Box
      className={cn(
        "min-w-0 flex-col overflow-hidden rounded-xl border bg-card",
        className,
      )}
    >
      <Box className="flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
        <Input
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder={searchPlaceholder}
          className="w-full md:max-w-md"
        />

        <Box className="items-center gap-2 md:hidden">
          <Box className="min-w-0 flex-1 [&>button]:h-10 [&>button]:w-full">
            <SelectInput
              value={activeSort?.id ?? noSortValue}
              onChange={handleMobileSortChange}
              options={[
                { value: noSortValue, label: "Ordenação padrão" },
                ...sortableColumns.map((column) => ({
                  value: column.id,
                  label: String(column.columnDef.header),
                })),
              ]}
              placeholder="Ordenar por"
            />
          </Box>
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            aria-label={
              activeSort?.desc
                ? "Ordenar em ordem crescente"
                : "Ordenar em ordem decrescente"
            }
            disabled={!activeSort}
            onClick={toggleMobileSortDirection}
          >
            {activeSort?.desc ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </Button>
        </Box>
      </Box>

      <Box className="flex-col md:hidden">
        <Box className="items-center gap-3 border-b px-4 py-3">
          <Checkbox
            aria-label="Selecionar todos"
            checked={!!table.getIsAllPageRowsSelected()}
            onCheckedChange={(checked) =>
              table.toggleAllPageRowsSelected(checked === true)
            }
          />
          <span className="text-sm text-muted-foreground">
            Selecionar todos
          </span>
        </Box>

        {table.getRowModel().rows.length ? (
          <Box className="flex-col divide-y">
            {table.getRowModel().rows.map((row) => {
              const cells = row.getVisibleCells()
              const accentColor = mobileCard.accentColor?.(row.original)
              const titleCell = cells.find(
                (cell) => cell.column.id === mobileCard.titleColumnId,
              )
              const detailCells = cells.filter(
                (cell) =>
                  cell.column.id !== mobileCard.titleColumnId &&
                  !hiddenMobileColumns.has(cell.column.id),
              )

              return (
                <article
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  style={
                    accentColor ? { borderLeftColor: accentColor } : undefined
                  }
                  className={cn(
                    "cursor-pointer bg-card p-4 transition-colors data-[state=selected]:bg-muted/70",
                    accentColor && "border-l-[5px]",
                  )}
                  onClick={row.getToggleSelectedHandler()}
                >
                  <Box className="min-w-0 items-start gap-3">
                    <Box
                      className="pt-0.5"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Checkbox
                        aria-label="Selecionar registro"
                        checked={row.getIsSelected()}
                        onCheckedChange={(checked) =>
                          row.toggleSelected(checked === true)
                        }
                      />
                    </Box>

                    <Box className="min-w-0 flex-1 flex-col gap-4">
                      <Box className="min-w-0 items-start justify-between gap-2">
                        {titleCell ? (
                          <Box className="min-w-0 flex-1 text-base font-semibold break-words [overflow-wrap:anywhere] [&_*]:whitespace-normal">
                            {flexRender(
                              titleCell.column.columnDef.cell,
                              titleCell.getContext(),
                            )}
                          </Box>
                        ) : null}
                        {hasRowActions ? (
                          <Box
                            onClick={(event) => event.stopPropagation()}
                          >
                            {renderRowActions(row.original)}
                          </Box>
                        ) : null}
                      </Box>

                      {detailCells.length > 0 ? (
                        <Box className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-3">
                          {detailCells.map((cell) => (
                            <Box
                              key={cell.id}
                              className="min-w-0 flex-col gap-1"
                            >
                              <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                {typeof cell.column.columnDef.header === "string"
                                  ? cell.column.columnDef.header
                                  : cell.column.id}
                              </span>
                              <Box className="min-w-0 text-sm break-words [overflow-wrap:anywhere] [&_*]:whitespace-normal">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      ) : null}
                    </Box>
                  </Box>
                </article>
              )
            })}
          </Box>
        ) : (
          <Box className="min-h-24 items-center justify-center p-4 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </Box>
        )}
      </Box>

      <Box className="hidden min-w-0 md:block">
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
                      ["createdAt", "updatedAt"].includes(header.column.id) &&
                        "max-lg:hidden",
                      hiddenTabletColumns.has(header.column.id) && "max-lg:hidden",
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
                          ? <ChevronUpIcon className="size-4" />
                          : header.column.getIsSorted() === "desc"
                            ? <ChevronDownIcon className="size-4" />
                            : null}
                      </Box>
                    )}
                  </TableHead>
                ))}

                {hasRowActions ? (
                  <TableHead className="w-24 px-4 text-right">
                    <span className="sr-only">Ações</span>
                  </TableHead>
                ) : null}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const accentColor = mobileCard.accentColor?.(row.original)

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer"
                    onClick={row.getToggleSelectedHandler()}
                  >
                    <TableCell
                      style={
                        accentColor
                          ? { borderLeftColor: accentColor }
                          : undefined
                      }
                      className={cn(
                        "relative w-10 px-2 text-center",
                        accentColor &&
                          "[&_[data-slot=checkbox]]:translate-x-1",
                      )}
                      onClick={(event) => event.stopPropagation()}
                    >
                      {accentColor ? (
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-y-0 left-0 w-[5px]"
                          style={{ backgroundColor: accentColor }}
                        />
                      ) : null}
                      <Checkbox
                        aria-label="Selecionar linha"
                        checked={row.getIsSelected()}
                        onCheckedChange={(checked) =>
                          row.toggleSelected(checked === true)
                        }
                      />
                    </TableCell>

                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          ["createdAt", "updatedAt"].includes(cell.column.id) &&
                            "max-lg:hidden",
                          hiddenTabletColumns.has(cell.column.id) &&
                            "max-lg:hidden",
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}

                    {hasRowActions ? (
                      <TableCell
                        className="w-24 px-4"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {renderRowActions(row.original)}
                      </TableCell>
                    ) : null}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1 + (hasRowActions ? 1 : 0)}
                  className="h-20 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  )
}

export {
  DataTable,
  type DataTableProps,
  type MobileCardConfig,
  type RowActions,
}
