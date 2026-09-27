"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"

import { leadUpsertSchema, type LeadUpsertFormValues } from "@/features/schema"
import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Typography } from "@/shared/components/ui/typography"

type LeadFormProps = {
  initialValues?: Partial<LeadUpsertFormValues>
  onSubmit: (values: LeadUpsertFormValues) => Promise<void> | void
  onCancel?: () => void
  submitLabel?: string
  isSubmitting?: boolean
}

const DEFAULT_VALUES: LeadUpsertFormValues = {
  name: "",
  phoneNumber: "",
}

export function LeadForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  isSubmitting = false,
}: Readonly<LeadFormProps>) {
  const normalizedInitialValues = useMemo(
    () => ({
      ...DEFAULT_VALUES,
      ...initialValues,
    }),
    [initialValues],
  )

  const form = useForm<LeadUpsertFormValues>({
    resolver: zodResolver(leadUpsertSchema),
    defaultValues: normalizedInitialValues,
  })

  useEffect(() => {
    form.reset(normalizedInitialValues)
  }, [form, normalizedInitialValues])

  const isSubmitDisabled = isSubmitting || form.formState.isSubmitting

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({
      name: values.name.trim(),
      phoneNumber: values.phoneNumber.trim(),
    })
  })

  return (
    <Box asChild>
      <form
        className="crud-modal-form w-full flex-col gap-4"
        onSubmit={handleSubmit}
        noValidate
      >
        <Box className="flex-col gap-1.5">
          <Label htmlFor="lead-name">Nome</Label>

          <Controller
            control={form.control}
            name="name"
            render={({ field }) => (
              <Input
                {...field}
                id="lead-name"
                placeholder="Ex.: Maria Souza"
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
          <Label htmlFor="lead-phone">Telefone</Label>

          <Controller
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <Input
                {...field}
                id="lead-phone"
                inputMode="numeric"
                placeholder="11999999999"
                aria-invalid={!!form.formState.errors.phoneNumber}
              />
            )}
          />

          {form.formState.errors.phoneNumber?.message ? (
            <Typography variant="small" className="text-destructive">
              {form.formState.errors.phoneNumber.message}
            </Typography>
          ) : null}
        </Box>

        <Box className="crud-modal-form-actions crud-modal-form-actions-bottom flex-row justify-end gap-2 pt-2 [&>button]:min-w-0 [&>button]:flex-1 sm:[&>button]:flex-none">
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

