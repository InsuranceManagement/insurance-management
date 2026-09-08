"use client"

import { type OnChangeFn, type RowSelectionState } from "@tanstack/react-table"
import { useMemo, useState, type ReactNode } from "react"

import { Box } from "@/shared/components/ui/box"
import { Card } from "@/shared/components/ui/card"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Input } from "@/shared/components/ui/input"
import { Typography } from "@/shared/components/ui/typography"
import { cn } from "@/shared/lib/utils"
import { type EntityWithName } from "@/shared/models/entity"

export type CrudCardRenderContext<TData> = {
  entity: TData
  isSelected: boolean
}

export type CrudCardView<TData> = {
  renderCard: (context: CrudCardRenderContext<TData>) => ReactNode
  getSearchText?: (entity: TData) => string
  gridClassName?: string
  searchPlaceholder?: string
}

type CrudCardListProps<TData extends EntityWithName> = {
  data: TData[]
  rowSelection: RowSelectionState
  setRowSelection: OnChangeFn<RowSelectionState>
  cardView: CrudCardView<TData>
  emptyMessage?: string
}

export function CrudCardList<TData extends EntityWithName>({
  data,
  rowSelection,
  setRowSelection,
  cardView,
  emptyMessage = "Sem dados para exibir.",
}: Readonly<CrudCardListProps<TData>>) {
  const [search, setSearch] = useState("")
  const normalizedSearch = search.trim().toLocaleLowerCase()
  const filteredRows = useMemo(
    () =>
      data
        .map((entity, index) => ({ entity, index }))
        .filter(({ entity }) => {
          if (!normalizedSearch) return true

          const searchText = cardView.getSearchText?.(entity) ?? entity.name
          return searchText.toLocaleLowerCase().includes(normalizedSearch)
        }),
    [cardView, data, normalizedSearch],
  )

  const handleSelectionChange = (index: number, isSelected: boolean) => {
    setRowSelection((currentSelection) => {
      const nextSelection = { ...currentSelection }

      if (isSelected) {
        nextSelection[index] = true
      } else {
        delete nextSelection[index]
      }

      return nextSelection
    })
  }

  return (
    <Box className="flex-col gap-4 rounded-xl border bg-card p-4">
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={cardView.searchPlaceholder ?? "Buscar..."}
        className="max-w-md"
      />

      {filteredRows.length ? (
        <Box
          className={cn(
            "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3",
            cardView.gridClassName,
          )}
        >
          {filteredRows.map(({ entity, index }) => {
            const isSelected = rowSelection[index] === true

            return (
              <Card
                key={entity.id}
                size="sm"
                className={cn(
                  "relative gap-0 transition-shadow",
                  isSelected && "ring-2 ring-primary",
                )}
              >
                <Box className="absolute top-4 right-4 z-10">
                  <Checkbox
                    aria-label={`Selecionar ${entity.name}`}
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      handleSelectionChange(index, checked === true)
                    }
                  />
                </Box>

                {cardView.renderCard({ entity, isSelected })}
              </Card>
            )
          })}
        </Box>
      ) : (
        <Box className="h-32 items-center justify-center text-center">
          <Typography variant="muted">{emptyMessage}</Typography>
        </Box>
      )}
    </Box>
  )
}
