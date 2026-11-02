"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { useEffect, useMemo, useRef } from "react"
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

const availableVariables = [
  { key: "client.name", label: "Nome do cliente" },
  { key: "client.email", label: "E-mail do cliente" },
  { key: "client.phoneNumber", label: "Telefone do cliente" },
  { key: "client.birthDate", label: "Data de nascimento" },
  { key: "client.id", label: "ID do cliente" },
  { key: "context.today", label: "Data atual" },
] as const

function toFormValues(
  initialValues?: Partial<NotificationTemplateUpsertPayload>,
): NotificationTemplateFormValues {
  return {
    name: initialValues?.name ?? "",
    description: initialValues?.description ?? "",
    subject: initialValues?.subject ?? "",
    body: initialValues?.body ?? "",
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
  const bodyRef = useRef<HTMLTextAreaElement | null>(null)
  const bodyField = form.register("body")

  useEffect(() => {
    form.reset(normalizedInitialValues)
  }, [form, normalizedInitialValues])

  const isSubmitDisabled = isSubmitting || form.formState.isSubmitting

  const isEditing = !!initialValues

  const insertVariable = (variable: (typeof availableVariables)[number]) => {
    const body = form.getValues("body")
    const textarea = bodyRef.current
    const start = textarea?.selectionStart ?? body.length
    const end = textarea?.selectionEnd ?? body.length
    const placeholder = `{{${variable.key}}}`

    form.setValue("body", body.slice(0, start) + placeholder + body.slice(end), {
      shouldDirty: true,
      shouldValidate: true,
    })

    if (!form.getValues("variablePairs").some((pair) => pair.key === variable.key)) {
      append({ key: variable.key, value: variable.label })
    }

    requestAnimationFrame(() => {
      textarea?.focus()
      textarea?.setSelectionRange(start + placeholder.length, start + placeholder.length)
    })
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    const variableSchema = values.variablePairs.reduce<Record<string, string>>(
      (acc, pair) => {
        if (pair.key) acc[pair.key] = pair.value

        return acc
      },
      {},
    )
    const notificationTypeId = initialValues?.notificationTypeId?.trim() || null
    const hasVariableSchema = Object.keys(variableSchema).length > 0

    const payload: NotificationTemplateUpsertPayload = {
      name: values.name.trim(),
      description: values.description?.trim() || null,
      subject: values.subject.trim(),
      body: values.body.trim(),
      isActive: isEditing ? values.isActive : true,
      // Na edição o serviço externo exige as 7 chaves presentes (null é
      // aceito). Na criação ele exige notificationTypeId/variableSchema como
      // valores reais quando enviados, então omitimos em vez de mandar null.
      ...(isEditing
        ? {
            notificationTypeId,
            variableSchema: hasVariableSchema ? variableSchema : null,
          }
        : {
            ...(hasVariableSchema ? { variableSchema } : {}),
          }),
    }

    await onSubmit(payload)
  })

  return (
    <Box asChild>
      <form
        className="crud-modal-form w-full min-w-0 flex-col gap-4 pb-8"
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
            Corpo da mensagem
          </Label>
          <Typography variant="small" className="text-muted-foreground">
            Escolha uma variável abaixo para inseri-la na mensagem.
          </Typography>
          <Textarea
            id="notification-template-body"
            rows={8}
            {...bodyField}
            ref={(element) => {
              bodyField.ref(element)
              bodyRef.current = element
            }}
            aria-invalid={!!form.formState.errors.body}
          />
          {form.formState.errors.body?.message ? (
            <Typography variant="small" className="text-destructive">
              {form.formState.errors.body.message}
            </Typography>
          ) : null}
          <Typography variant="small" className="text-muted-foreground">
            Variáveis disponíveis:
          </Typography>
          <Box className="flex-wrap gap-2">
            {availableVariables.map((variable) => (
              <Button
                key={variable.key}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertVariable(variable)}
              >
                {variable.label}
              </Button>
            ))}
          </Box>
        </Box>

        {isEditing ? (
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
        ) : null}

        <details className="border-t pt-4">
          <summary className="cursor-pointer text-sm font-medium">
            Configuração avançada de variáveis
          </summary>
          <Box className="flex-col gap-3 pt-3">
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
        </details>

        <Box className="crud-modal-form-actions mb-4 flex-row justify-end gap-2 border-t pt-4 [&>button]:min-w-0 [&>button]:flex-1 sm:[&>button]:flex-none">
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
