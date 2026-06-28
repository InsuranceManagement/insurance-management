"use client"

import { ChevronDownIcon } from "lucide-react"
import * as React from "react"
import { Popover } from "radix-ui"

import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Typography } from "@/shared/components/ui/typography"
import { cn } from "@/shared/lib/utils"

export type MultiSelectOption = {
  label: string
  value: string
  disabled?: boolean
}

export type MultiSelectInputProps = {
  id?: string
  value?: string[]
  onChange: (value: string[]) => void
  options: MultiSelectOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  isInvalid?: boolean
}

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

export function MultiSelectInput({
  id,
  value = [],
  onChange,
  options,
  placeholder = "Selecione uma ou mais opções",
  searchPlaceholder = "Pesquisar opções...",
  emptyMessage = "Nenhuma opção encontrada.",
  disabled = false,
  isInvalid = false,
}: Readonly<MultiSelectInputProps>) {
  const generatedId = React.useId()
  const triggerId = id ?? generatedId
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    const normalizedSearch = normalizeSearchValue(search)

    if (!normalizedSearch) return options

    return options.filter((option) =>
      normalizeSearchValue(option.label).includes(normalizedSearch),
    )
  }, [options, search])

  const selectedLabels = React.useMemo(
    () =>
      value
        .map(
          (selectedValue) =>
            options.find((option) => option.value === selectedValue)?.label,
        )
        .filter((label): label is string => !!label),
    [options, value],
  )

  const selectedTitle = selectedLabels.length
    ? selectedLabels.join(", ")
    : placeholder

  const selectedText =
    selectedLabels.length === 0
      ? placeholder
      : selectedLabels.length === 1
        ? selectedLabels[0]
        : `${selectedLabels.length} itens selecionados`

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)

    if (!open) setSearch("")
  }

  const handleOptionChange = (optionValue: string, checked: boolean) => {
    const nextValue = checked
      ? Array.from(new Set([...value, optionValue]))
      : value.filter((selectedValue) => selectedValue !== optionValue)

    onChange(nextValue)
  }

  return (
    <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <Button
          ref={triggerRef}
          id={triggerId}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-invalid={isInvalid}
          aria-expanded={isOpen}
          role="combobox"
          className="min-w-0 max-w-full shrink overflow-hidden w-full justify-between font-normal"
        >
          <Typography
            asChild
            variant="small"
            className={cn(
              "min-w-0 flex-1 truncate text-left font-normal",
              selectedLabels.length === 0 && "text-muted-foreground",
            )}
          >
            <span title={selectedTitle}>{selectedText}</span>
          </Typography>

          <ChevronDownIcon data-icon="inline-end" aria-hidden />
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          side="bottom"
          sideOffset={4}
          collisionPadding={16}
          className="z-[70] max-h-[min(20rem,var(--radix-popover-content-available-height))] w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10"
        >
          <Box
            className="flex-col"
            aria-label="Opções do campo de seleção múltipla"
          >
            <Box className="border-b p-2">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
              />
            </Box>

            <Box
              role="listbox"
              aria-multiselectable="true"
              className="grid max-h-[min(14rem,var(--radix-popover-content-available-height))] overflow-y-auto overscroll-contain p-1"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const checkboxId = `${triggerId}-${option.value}`
                  const isSelected = value.includes(option.value)

                  return (
                    <Label
                      key={option.value}
                      htmlFor={checkboxId}
                      role="option"
                      aria-selected={isSelected}
                      className="cursor-pointer rounded-sm px-2 py-2 font-normal hover:bg-accent"
                    >
                      <Checkbox
                        id={checkboxId}
                        checked={isSelected}
                        disabled={option.disabled}
                        onCheckedChange={(checked) =>
                          handleOptionChange(option.value, checked === true)
                        }
                      />

                      <Typography
                        asChild
                        variant="small"
                        className="min-w-0 flex-1 font-normal"
                      >
                        <span>{option.label}</span>
                      </Typography>
                    </Label>
                  )
                })
              ) : (
                <Typography
                  variant="small"
                  className="p-4 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </Typography>
              )}
            </Box>
          </Box>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
