"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"

import {
  type InsuranceCompanyUpsertFormValues,
  insuranceCompanyUpsertSchema,
} from "@/features/schema"
import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Typography } from "@/shared/components/ui/typography"

type InsuranceCompanyFormProps = {
  initialValues?: Partial<InsuranceCompanyUpsertFormValues>
  onSubmit: (values: InsuranceCompanyUpsertFormValues) => Promise<void> | void
  onCancel?: () => void
  submitLabel?: string
  isSubmitting?: boolean
}

const DEFAULT_VALUES: InsuranceCompanyUpsertFormValues = {
  name: "",
  color: "",
}

const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/

export function InsuranceCompanyForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  isSubmitting = false,
}: Readonly<InsuranceCompanyFormProps>) {
  const normalizedInitialValues = useMemo(
    () => ({
      ...DEFAULT_VALUES,
      ...initialValues,
    }),
    [initialValues],
  )

  const form = useForm<InsuranceCompanyUpsertFormValues>({
    resolver: zodResolver(insuranceCompanyUpsertSchema),
    defaultValues: normalizedInitialValues,
  })

  useEffect(() => {
    form.reset(normalizedInitialValues)
  }, [form, normalizedInitialValues])

  const isSubmitDisabled = isSubmitting || form.formState.isSubmitting

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload: InsuranceCompanyUpsertFormValues = {
      name: values.name.trim(),
      color: values.color.trim().toUpperCase(),
    }

    await onSubmit(payload)
  })

  return (
    <Box asChild>
      <form
        className="w-full flex-col gap-4"
        onSubmit={handleSubmit}
        noValidate
      >
        <Box className="flex-col gap-1.5">
          <Typography asChild variant="small" className="font-medium">
            <label htmlFor="insurance-company-name">Nome</label>
          </Typography>

          <Controller
            control={form.control}
            name="name"
            render={({ field }) => (
              <Input
                {...field}
                id="insurance-company-name"
                placeholder="Ex.: Protecao Total"
                aria-invalid={!!form.formState.errors.name}
              />
            )}
          />

          {form.formState.errors.name?.message ? (
            <Typography variant="small" className="text-destructive">
              {form.formState.errors.name.message}
            </Typography>
          ) : null}
        </Box>

        <Box className="flex-col gap-1.5">
          <Typography asChild variant="small" className="font-medium">
            <label htmlFor="insurance-company-color">Cor</label>
          </Typography>

          <Controller
            control={form.control}
            name="color"
            render={({ field }) => {
              const colorPickerValue = HEX_COLOR_REGEX.test(field.value)
                ? field.value
                : "#0A5CFF"

              return (
                <Box className="items-center gap-2">
                  <Input
                    id="insurance-company-color"
                    type="color"
                    className="h-9 w-12 cursor-pointer p-1"
                    value={colorPickerValue}
                    aria-label="Selecionar cor"
                    onBlur={field.onBlur}
                    onChange={(event) => field.onChange(event.target.value)}
                  />

                  <Input
                    id="insurance-company-color-hex"
                    name={field.name}
                    ref={field.ref}
                    value={field.value}
                    placeholder="#0A5CFF"
                    maxLength={7}
                    aria-invalid={!!form.formState.errors.color}
                    onBlur={field.onBlur}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                </Box>
              )
            }}
          />

          {form.formState.errors.color?.message ? (
            <Typography variant="small" className="text-destructive">
              {form.formState.errors.color.message}
            </Typography>
          ) : null}
        </Box>

        <Box className="justify-end gap-2 pt-2">
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          ) : null}

          <Button type="submit" disabled={isSubmitDisabled}>
            {submitLabel}
          </Button>
        </Box>
      </form>
    </Box>
  )
}
