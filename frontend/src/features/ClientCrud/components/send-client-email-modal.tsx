"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Mail, Send } from "lucide-react"
import { useMemo } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"

import { type Client } from "@/features/ClientCrud/models/client"
import { type NotificationTemplate } from "@/features/NotificationTemplateCrud/models/notification-template"
import {
  sendClientEmailSchema,
  type SendClientEmailFormValues,
} from "@/features/schema"
import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Modal } from "@/shared/components/ui/modal"
import { SelectInput } from "@/shared/components/ui/select-input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Typography } from "@/shared/components/ui/typography"
import { routes } from "@/shared/constants/routes"
import { useApiMutation } from "@/shared/hooks/use-api-mutation"
import { useApiQuery } from "@/shared/hooks/use-api-query"
import { formatDate } from "@/shared/lib/date-format"

type SendClientEmailPayload = {
  templateId?: string
  subject?: string
  message?: string
}

type SendClientEmailModalProps = {
  client: Client | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type SendClientEmailFormProps = {
  client: Client
  open: boolean
  onClose: () => void
}

const emptyTemplates: NotificationTemplate[] = []

function applyClientVariables(text: string, client: Client): string {
  const replacements: Record<string, string> = {
    "client.id": client.id,
    "client.name": client.name,
    "client.email": client.email,
    "client.phoneNumber": client.phoneNumber,
    "client.birthDate": formatDate(client.birthDate, "DD/MM/YYYY", client.birthDate),
    "context.today": formatDate(new Date().toISOString(), "DD/MM/YYYY"),
  }

  return Object.entries(replacements).reduce(
    (acc, [key, value]) => acc.replaceAll(`{{${key}}}`, value),
    text,
  )
}

function SendClientEmailForm({
  client,
  open,
  onClose,
}: Readonly<SendClientEmailFormProps>) {
  const queryClient = useQueryClient()

  const form = useForm<SendClientEmailFormValues>({
    resolver: zodResolver(sendClientEmailSchema),
    defaultValues: {
      mode: "custom",
      subject: "",
      message: "",
      templateId: "",
    },
  })

  const mode = useWatch({ control: form.control, name: "mode" })
  const selectedTemplateId = useWatch({
    control: form.control,
    name: "templateId",
  })

  const templatesQuery = useApiQuery<NotificationTemplate[]>({
    route: routes.notifications.templates,
    enabled: open && mode === "template",
  })

  const activeTemplates = useMemo(() => {
    const templates = templatesQuery.data ?? emptyTemplates
    return templates.filter((template) => template.isActive)
  }, [templatesQuery.data])

  const templateOptions = useMemo(
    () =>
      activeTemplates.map((template) => ({
        value: template.id,
        label: template.name,
      })),
    [activeTemplates],
  )

  const selectedTemplate = useMemo(
    () =>
      activeTemplates.find((template) => template.id === selectedTemplateId),
    [activeTemplates, selectedTemplateId],
  )

  const sendEmailMutation = useApiMutation<void, SendClientEmailPayload>({
    route: routes.clients.sendEmailById,
    meta: { successMessage: "E-mail enviado com sucesso." },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["api", "GET", "/notifications/logs"],
      })
      onClose()
    },
  })

  const isSubmitting =
    sendEmailMutation.isPending || form.formState.isSubmitting

  const handleModeChange = (nextMode: "custom" | "template") => {
    form.setValue("mode", nextMode, { shouldValidate: false })
    form.clearErrors()
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload: SendClientEmailPayload =
      values.mode === "template"
        ? { templateId: values.templateId?.trim() }
        : {
            subject: values.subject?.trim(),
            message: values.message?.trim(),
          }

    await sendEmailMutation.mutateAsync({
      routeParams: [client.id],
      body: payload,
    })
  })

  return (
    <Box asChild>
      <form
        className="crud-modal-form w-full min-w-0 flex-col gap-4 pb-2"
        onSubmit={handleSubmit}
        noValidate
      >
        <Box className="flex-col gap-1 rounded-md border bg-muted/40 p-3">
          <Typography
            variant="small"
            className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          >
            Destinatário
          </Typography>
          <Box className="flex-wrap items-center gap-2 text-sm">
            <Mail className="size-4 shrink-0 text-muted-foreground" />
            <span className="font-medium">{client.name}</span>
            <span className="break-all text-muted-foreground">
              ({client.email})
            </span>
          </Box>
        </Box>

        <Box className="flex-col gap-1.5">
          <Label>Modo de envio</Label>
          <Box className="flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={mode === "custom" ? "default" : "outline"}
              disabled={isSubmitting}
              onClick={() => handleModeChange("custom")}
            >
              Mensagem personalizada
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === "template" ? "default" : "outline"}
              disabled={isSubmitting}
              onClick={() => handleModeChange("template")}
            >
              Usar template
            </Button>
          </Box>
        </Box>

        {mode === "custom" ? (
          <>
            <Box className="flex-col gap-1.5">
              <Label htmlFor="client-email-subject">Assunto</Label>
              <Input
                id="client-email-subject"
                placeholder="Ex.: Atualização sobre sua apólice"
                disabled={isSubmitting}
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
              <Label htmlFor="client-email-message">Mensagem</Label>
              <Textarea
                id="client-email-message"
                rows={7}
                placeholder="Escreva a mensagem que será enviada para o e-mail do cliente..."
                disabled={isSubmitting}
                {...form.register("message")}
                aria-invalid={!!form.formState.errors.message}
              />
              {form.formState.errors.message?.message ? (
                <Typography variant="small" className="text-destructive">
                  {form.formState.errors.message.message}
                </Typography>
              ) : null}
            </Box>
          </>
        ) : (
          <Box className="flex-col gap-3">
            <Box className="flex-col gap-1.5">
              <Label htmlFor="client-email-template">Template ativo</Label>
              <Controller
                control={form.control}
                name="templateId"
                render={({ field }) => (
                  <SelectInput
                    id="client-email-template"
                    value={field.value || undefined}
                    onChange={field.onChange}
                    options={templateOptions}
                    placeholder={
                      templatesQuery.isLoading
                        ? "Carregando templates..."
                        : "Selecione um template"
                    }
                    disabled={isSubmitting || templatesQuery.isLoading}
                    isInvalid={!!form.formState.errors.templateId}
                  />
                )}
              />
              {form.formState.errors.templateId?.message ? (
                <Typography variant="small" className="text-destructive">
                  {form.formState.errors.templateId.message}
                </Typography>
              ) : null}
              {!templatesQuery.isLoading && activeTemplates.length === 0 ? (
                <Typography variant="small" className="text-muted-foreground">
                  Nenhum template ativo disponível para envio.
                </Typography>
              ) : null}
            </Box>

            {selectedTemplate ? (
              <Box className="flex-col gap-2 rounded-md border bg-muted/30 p-3">
                <Typography
                  variant="small"
                  className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                >
                  Pré-visualização
                </Typography>
                <Box className="flex-col gap-1">
                  <Typography variant="small" className="font-semibold">
                    Assunto: {applyClientVariables(selectedTemplate.subject, client)}
                  </Typography>
                  <Typography
                    variant="p"
                    className="whitespace-pre-wrap text-sm text-muted-foreground"
                  >
                    {applyClientVariables(selectedTemplate.body, client)}
                  </Typography>
                </Box>
              </Box>
            ) : null}
          </Box>
        )}

        <Box className="crud-modal-form-actions flex-row justify-end gap-2 border-t pt-4 [&>button]:min-w-0 [&>button]:flex-1 sm:[&>button]:flex-none">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              (mode === "template" &&
                !templatesQuery.isLoading &&
                activeTemplates.length === 0)
            }
          >
            <Send className="size-4" />
            {isSubmitting ? "Enviando..." : "Enviar e-mail"}
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export function SendClientEmailModal({
  client,
  open,
  onOpenChange,
}: Readonly<SendClientEmailModalProps>) {
  return (
    <Modal
      open={open && !!client}
      onOpenChange={onOpenChange}
      title="Enviar e-mail ao cliente"
      contentClassName="sm:max-w-2xl"
      mobileFullscreen
    >
      {client ? (
        <SendClientEmailForm
          key={client.id}
          client={client}
          open={open}
          onClose={() => onOpenChange(false)}
        />
      ) : null}
    </Modal>
  )
}
