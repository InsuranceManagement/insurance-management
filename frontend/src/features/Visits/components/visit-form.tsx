"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { type Client } from "@/features/ClientCrud/models/client"
import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Typography } from "@/shared/components/ui/typography"
import { type VisitUpsertPayload } from "../models/visit"

const visitFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o título da visita."),
  description: z.string().trim().min(1, "Informe a descrição da visita."),
  clientId: z.string().min(1, "Selecione um cliente."),
  date: z.string().min(1, "Informe a data e hora da visita."),
})

type VisitFormValues = Omit<VisitUpsertPayload, "date"> & { date: string }

type VisitFormProps = {
  clients: Client[]
  initialValues: VisitFormValues
  isSubmitting: boolean
  submitLabel: string
  onCancel: () => void
  onSubmit: (payload: VisitUpsertPayload) => void
  onDelete?: () => void
}

export function VisitForm({
  clients,
  initialValues,
  isSubmitting,
  submitLabel,
  onCancel,
  onSubmit,
  onDelete,
}: Readonly<VisitFormProps>) {
  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitFormSchema),
    defaultValues: initialValues,
  })

  useEffect(() => form.reset(initialValues), [form, initialValues])

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit({
      ...values,
      name: values.name.trim(),
      description: values.description.trim(),
      date: new Date(values.date).toISOString(),
    })
  })

  return (
    <Box asChild>
      <form className="flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <Box className="flex-col gap-1.5">
          <Label htmlFor="visit-name">Título</Label>
          <Input id="visit-name" {...form.register("name")} aria-invalid={!!form.formState.errors.name} />
          {form.formState.errors.name?.message ? <Typography variant="small" className="text-destructive">{form.formState.errors.name.message}</Typography> : null}
        </Box>

        <Box className="flex-col gap-1.5">
          <Label htmlFor="visit-description">Descrição</Label>
          <Input id="visit-description" {...form.register("description")} aria-invalid={!!form.formState.errors.description} />
          {form.formState.errors.description?.message ? <Typography variant="small" className="text-destructive">{form.formState.errors.description.message}</Typography> : null}
        </Box>

        <Box className="flex-col gap-1.5">
          <Label>Cliente</Label>
          <Controller control={form.control} name="clientId" render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
              <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.clientId}><SelectValue placeholder="Selecione um cliente" /></SelectTrigger>
              <SelectContent>{clients.map((client) => <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>)}</SelectContent>
            </Select>
          )} />
          {form.formState.errors.clientId?.message ? <Typography variant="small" className="text-destructive">{form.formState.errors.clientId.message}</Typography> : null}
        </Box>

        <Box className="flex-col gap-1.5">
          <Label htmlFor="visit-date">Data e hora</Label>
          <Input id="visit-date" type="datetime-local" {...form.register("date")} aria-invalid={!!form.formState.errors.date} />
          {form.formState.errors.date?.message ? <Typography variant="small" className="text-destructive">{form.formState.errors.date.message}</Typography> : null}
        </Box>

        <Box className="justify-between gap-2 border-t pt-4">
          {onDelete ? <Button type="button" variant="destructive" onClick={onDelete} disabled={isSubmitting}>Excluir</Button> : <Box />}
          <Box className="gap-2"><Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button><Button type="submit" disabled={isSubmitting}>{submitLabel}</Button></Box>
        </Box>
      </form>
    </Box>
  )
}
