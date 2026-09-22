"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { useEffect, useMemo } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"

import {
  notificationTemplateUpsertSchema,
  type NotificationTemplateFormValues,
} from "@/features/schema"
import { type NotificationTemplateUpsertPayload } from "@/features/NotificationTemplateCrud/models/notification-template"
import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Typography } from "@/shared/components/ui/typography"

type NotificationTemplateFormProps = {
  initialValues?: Partial<NotificationTemplateUpsertPayload>
  onSubmit: (values: NotificationTemplateUpsertPayload) => Promise<void> | void
  onCancel?: () => void
  submitLabel?: string
  isSubmitting?: boolean
}

function toFormValues(
  initialValues?: Partial<NotificationTemplateUpsertPayload>,
): NotificationTemplateFormValues {
  return {
    name: initialValues?.name ?? "",
    description: initialValues?.description ?? "",
    subject: initialValues?.subject ?? "",
    body: initialValues?.body ?? "",
    notificationTypeId: initialValues?.notificationTypeId ?? "",
    isActive: initialValues?.isActive ?? true,
    variablePairs: Object.entries(initialValues?.variableSchema ?? {}).map(
      ([key, value]) => ({ key, value }),
    ),
  }
}

export function NotificationTemplateForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  isSubmitting = false,
}: Readonly<NotificationTemplateFormProps>) {
  const normalizedInitialValues = useMemo(
    () => toFormValues(initialValues),
    [initialValues],
  )

  const form = useForm<NotificationTemplateFormValues>({
    resolver: zodResolver(notificationTemplateUpsertSchema),
    defaultValues: normalizedInitialValues,
  })
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variablePairs",
  })

  useEffect(() => {
    form.reset(normalizedInitialValues)
  }, [form, normalizedInitialValues])

  const isSubmitDisabled = isSubmitting || form.formState.isSubmitting

  const isEditing = !!initialValues

  const handleSubmit = form.handleSubmit(async (values) => {
    const variableSchema = values.variablePairs.reduce<Record<string, string>>(
      (acc, pair) => {
        if (pair.key) acc[pair.key] = pair.value

        return acc
      },
      {},
    )
    const notificationTypeId = values.notificationTypeId?.trim() || null
    const hasVariableSchema = Object.keys(variableSchema).length > 0

    const payload: NotificationTemplateUpsertPayload = {
      name: values.name.trim(),
      description: values.description?.trim() || null,
      subject: values.subject.trim(),
      body: values.body.trim(),
      isActive: values.isActive,
      // Na edição o serviço externo exige as 7 chaves presentes (null é
      // aceito). Na criação ele exige notificationTypeId/variableSchema como
      // valores reais quando enviados, então omitimos em vez de mandar null.
      ...(isEditing
        ? {
            notificationTypeId,
            variableSchema: hasVariableSchema ? variableSchema : null,
          }
        : {
            ...(notificationTypeId ? { notificationTypeId } : {}),
            ...(hasVariableSchema ? { variableSchema } : {}),
          }),
    }

    await onSubmit(payload)
  })

  return (
    <Box asChild>
      <form
        className="w-full min-w-0 flex-col gap-4 pb-8"
        onSubmit={handleSubmit}
        noValidate
      >
        <Box className="flex-col gap-1.5">
          <Label htmlFor="notification-template-name">Nome</Label>
          <Input
            id="notification-template-name"
            {...form.register("name")}
            aria-invalid={!!form.formState.errors.name}
          />
          {form.formState.errors.name?.message ? (
            <Typography variant="small" className="text-destructive">
              {form.formState.errors.name.message}
            </Typography>
          ) : null}
        </Box>

        <Box className="flex-col gap-1.5">
          <Label htmlFor="notification-template-description">
            Descrição
          </Label>
          <Input
            id="notification-template-description"
            {...form.register("description")}
            aria-invalid={!!form.formState.errors.description}
          />
        </Box>

        <Box className="flex-col gap-1.5">
          <Label htmlFor="notification-template-subject">Assunto</Label>
          <Input
            id="notification-template-subject"
            {...form.register("subject")}
            aria-invalid={!!form.formState.errors.subject}
          />
          {form.formState.errors.subject?.message ? (
            <Typography variant="small" className="text-destructive">
              {form.formState.errors.subject.message}
            </Typography>
          ) : null}
        </Box>

        <Box className="flex-col gap-1.5">
          <Label htmlFor="notification-template-body">
            Corpo (HTML)
          </Label>
          <Textarea
            id="notification-template-body"
            rows={8}
            {...form.register("body")}
            aria-invalid={!!form.formState.errors.body}
          />
          {form.formState.errors.body?.message ? (
            <Typography variant="small" className="text-destructive">
              {form.formState.errors.body.message}
            </Typography>
          ) : null}
        </Box>

        <Box className="flex-col gap-1.5">
          <Label htmlFor="notification-template-notification-type-id">
            ID do tipo de notificação
          </Label>
          <Input
            id="notification-template-notification-type-id"
            {...form.register("notificationTypeId")}
            placeholder="Opcional"
          />
        </Box>

        <Controller
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <Box className="items-center justify-between rounded-md border p-3">
              <Typography variant="small">Template ativo</Typography>
              <Input
                type="checkbox"
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
                className="size-4"
              />
            </Box>
          )}
        />

        <Box className="flex-col gap-3 border-t pt-4">
          <Box className="flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Typography variant="small" className="font-medium">
              Variáveis do template
            </Typography>
            <Button
              className="w-full sm:w-auto"
              type="button"
              size="sm"
              variant="outline"
              onClick={() => append({ key: "", value: "" })}
            >
              <PlusIcon />
              Adicionar
            </Button>
          </Box>

          {fields.length === 0 ? (
            <Typography variant="small" className="text-muted-foreground">
              Sem variáveis configuradas.
            </Typography>
          ) : null}

          {fields.map((item, index) => (
            <Box
              key={item.id}
              className="min-w-0 flex-col items-stretch gap-2 rounded-md border p-3 sm:flex-row sm:items-center"
            >
              <Input
                className="min-w-0 w-full"
                {...form.register(`variablePairs.${index}.key`)}
                placeholder="Chave"
              />
              <Input
                className="min-w-0 w-full"
                {...form.register(`variablePairs.${index}.value`)}
                placeholder="Descrição da variável"
              />
              <Button
                className="self-end sm:self-auto"
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label="Remover variável"
                onClick={() => remove(index)}
              >
                <Trash2Icon />
              </Button>
            </Box>
          ))}
        </Box>

        <Box className="mb-4 flex-row justify-end gap-2 border-t pt-4 [&>button]:min-w-0 [&>button]:flex-1 sm:[&>button]:flex-none">
          {onCancel ? (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitDisabled}
            >
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
