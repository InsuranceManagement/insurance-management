"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { type Client } from "@/features/ClientCrud/models/client"
import { Box } from "@/shared/components/ui/box"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Typography } from "@/shared/components/ui/typography"
import { formatDate } from "@/shared/lib/date-format"
import { type VisitUpsertPayload } from "../models/visit"

const PAST_VISIT_DATE_MESSAGE =
  "Não é possível agendar uma visita para uma data e hora que já passaram."

const visitFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o título da visita."),
  description: z.string().trim().min(1, "Informe a descrição da visita."),
  clientId: z.string().min(1, "Selecione um cliente."),
  date: z.string().min(1, "Informe a data e hora da visita."),
})

function getMinimumDateTime() {
  const minimumDate = new Date()
  minimumDate.setSeconds(0, 0)
  minimumDate.setMinutes(minimumDate.getMinutes() + 1)

  return formatDate(minimumDate, "YYYY-MM-DDTHH:mm", "")
}

type VisitFormValues = Omit<VisitUpsertPayload, "date"> & { date: string }

type VisitFormProps = {
  clients: Client[]
  initialValues: VisitFormValues
  isEditing: boolean
  isSubmitting: boolean
  onSubmit: (payload: VisitUpsertPayload) => void
}

export function VisitForm({
  clients,
  initialValues,
  isEditing,
  isSubmitting,
  onSubmit,
}: Readonly<VisitFormProps>) {
  const [minimumDateTime] = useState(getMinimumDateTime)
  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitFormSchema),
    defaultValues: initialValues,
  })

  useEffect(() => form.reset(initialValues), [form, initialValues])

  const handleSubmit = form.handleSubmit((values) => {
    const selectedDate = new Date(values.date)
    const initialDate = initialValues.date ? new Date(initialValues.date) : null
    const dateIsUnchanged =
      isEditing &&
      initialDate !== null &&
      Math.floor(selectedDate.getTime() / 60_000) ===
        Math.floor(initialDate.getTime() / 60_000)

    if (!dateIsUnchanged && values.date < minimumDateTime) {
      form.setError("date", {
        type: "validate",
        message: PAST_VISIT_DATE_MESSAGE,
      })
      toast.error(PAST_VISIT_DATE_MESSAGE)
      return
    }

    form.clearErrors("date")
    onSubmit({
      ...values,
      name: values.name.trim(),
      description: values.description.trim(),
      date: new Date(values.date).toISOString(),
    })
  })

  return (
    <Box asChild>
      <form
        id="visit-form"
        className="flex-col gap-4 max-md:mx-auto max-md:w-full max-md:max-w-lg max-md:flex-none"
        onSubmit={handleSubmit}
        noValidate
      >
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
          <Input id="visit-date" type="datetime-local" min={minimumDateTime} {...form.register("date")} aria-invalid={!!form.formState.errors.date} />
          {form.formState.errors.date?.message ? <Typography variant="small" className="text-destructive">{form.formState.errors.date.message}</Typography> : null}
        </Box>

      </form>
    </Box>
  )
}
