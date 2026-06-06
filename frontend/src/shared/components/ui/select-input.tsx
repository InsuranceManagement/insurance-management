"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

type Option = {
  label: string
  value: string
}

type SelectInputProps = {
  id?: string
  value?: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  disabled?: boolean
  isInvalid?: boolean
}

export function SelectInput({
  id,
  value,
  onChange,
  options,
  placeholder = "Selecione uma opção",
  disabled = false,
  isInvalid = false,
}: Readonly<SelectInputProps>) {
  return (
    <Select onValueChange={onChange} value={value} disabled={disabled}>
      <SelectTrigger id={id} aria-invalid={isInvalid}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
