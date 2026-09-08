"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { useEffect } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import {
  notificationRuleFields,
  notificationRuleFieldLabels,
  notificationRuleGroups,
  notificationRuleGroupLabels,
  notificationRuleOperators,
  notificationRuleOperatorLabels,
  type NotificationRuleCondition,
  type NotificationRuleFormCondition,
  type NotificationRuleGroup,
  type NotificationRuleUpsertPayload,
  type NotificationTemplate,
} from "@/features/NotificationRuleCrud/models/notification-rule"
import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Typography } from "@/shared/components/ui/typography"
import { routes } from "@/shared/constants/routes"
import { useApiQuery } from "@/shared/hooks/use-api-query"

const ruleFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome da regra."),
  templateId: z.string().min(1, "Selecione um template."),
  isActive: z.boolean(),
  conditionGroup: z.enum(notificationRuleGroups),
  conditions: z.array(
    z.object({
      field: z.enum(notificationRuleFields),
      operator: z.enum(notificationRuleOperators),
      value: z.string(),
      isRecurring: z.boolean(),
    }),
  ).min(1, "Inclua pelo menos uma condição."),
})

type RuleFormValues = {
  name: string
  templateId: string
  isActive: boolean
  conditionGroup: NotificationRuleGroup
  conditions: NotificationRuleFormCondition[]
}

type NotificationRuleFormProps = {
  initialValues?: Partial<NotificationRuleUpsertPayload>
  onSubmit: (values: NotificationRuleUpsertPayload) => Promise<void> | void
  onCancel?: () => void
  submitLabel?: string
  isSubmitting?: boolean
}

const defaultCondition: NotificationRuleFormCondition = {
  field: "context.today",
  operator: "EQUALS",
  value: "2026-12-25",
  isRecurring: true,
}

function parseValue(value: string): string {
  return value.trim()
}

function toFormConditions(condition?: NotificationRuleCondition): NotificationRuleFormCondition[] {
  const conditions = notificationRuleGroups.flatMap((group) =>
    (condition?.[group] ?? []).map((item) => ({
      ...item,
      value: String(item.value),
      isRecurring:
        item.isRecurring ??
        (item.field === "context.today" || item.value === "context.today"),
    })),
  )

  return conditions.length ? conditions : [defaultCondition]
}

function getConditionGroup(condition?: NotificationRuleCondition): NotificationRuleGroup {
  return notificationRuleGroups.find((group) => condition?.[group]?.length) ?? "all"
}

function toCondition(
  group: NotificationRuleGroup,
  conditions: NotificationRuleFormCondition[],
): NotificationRuleCondition {
  return {
    [group]: conditions.map((condition) => ({
      field: condition.field,
      operator: condition.operator,
      value: parseValue(condition.value),
      isRecurring: condition.isRecurring,
    })),
  }
}

export function NotificationRuleForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  isSubmitting = false,
}: Readonly<NotificationRuleFormProps>) {
  const { data: templates = [] } = useApiQuery<NotificationTemplate[]>({
    route: routes.notifications.templates,
    queryKey: ["notification-templates"],
    meta: { errorMessage: "Erro ao carregar templates." },
  })
  const form = useForm<RuleFormValues>({
    resolver: zodResolver(ruleFormSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      templateId: initialValues?.templateId ?? "",
      isActive: initialValues?.isActive ?? true,
      conditionGroup: getConditionGroup(initialValues?.condition),
      conditions: toFormConditions(initialValues?.condition),
    },
  })
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "conditions" })

  useEffect(() => {
    form.reset({
      name: initialValues?.name ?? "",
      templateId: initialValues?.templateId ?? "",
      isActive: initialValues?.isActive ?? true,
      conditionGroup: getConditionGroup(initialValues?.condition),
      conditions: toFormConditions(initialValues?.condition),
    })
  }, [form, initialValues])

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit({
      name: values.name.trim(),
      templateId: values.templateId,
      isActive: values.isActive,
      condition: toCondition(values.conditionGroup, values.conditions),
    })
  })

  return (
    <Box asChild>
      <form className="max-h-[76vh] flex-col gap-4 overflow-y-auto pr-1" onSubmit={handleSubmit} noValidate>
        <Box className="flex-col gap-1.5">
          <Label htmlFor="notification-rule-name">Nome</Label>
          <Input id="notification-rule-name" {...form.register("name")} aria-invalid={!!form.formState.errors.name} />
          {form.formState.errors.name?.message ? <Typography variant="small" className="text-destructive">{form.formState.errors.name.message}</Typography> : null}
        </Box>

        <Box className="flex-col gap-1.5">
          <Label>Template de e-mail</Label>
          <Controller control={form.control} name="templateId" render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.templateId}><SelectValue placeholder="Selecione um template" /></SelectTrigger>
              <SelectContent>{templates.filter((template) => template.isActive).map((template) => <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>)}</SelectContent>
            </Select>
          )} />
          {form.formState.errors.templateId?.message ? <Typography variant="small" className="text-destructive">{form.formState.errors.templateId.message}</Typography> : null}
        </Box>

        <Controller control={form.control} name="isActive" render={({ field }) => (
          <Box className="items-center justify-between rounded-md border p-3"><Typography variant="small">Regra ativa</Typography><Input type="checkbox" checked={field.value} onChange={(event) => field.onChange(event.target.checked)} className="size-4" /></Box>
        )} />

        <Box className="flex-col gap-3 border-t pt-4">
          <Box className="items-center justify-between gap-3">
            <Typography variant="small" className="font-medium">Condições</Typography>
            <Box className="items-center gap-2">
              <Controller control={form.control} name="conditionGroup" render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent>{notificationRuleGroups.map((group) => <SelectItem key={group} value={group}>{notificationRuleGroupLabels[group]}</SelectItem>)}</SelectContent></Select>} />
              <Button type="button" size="sm" variant="outline" onClick={() => append(defaultCondition)}><PlusIcon />Adicionar</Button>
            </Box>
          </Box>
          {fields.map((item, index) => (
            <Box key={item.id} className="grid grid-cols-1 gap-2 rounded-md border p-3 sm:grid-cols-2">
              <Controller control={form.control} name={`conditions.${index}.field`} render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{notificationRuleFields.map((ruleField) => <SelectItem key={ruleField} value={ruleField}>{notificationRuleFieldLabels[ruleField]}</SelectItem>)}</SelectContent></Select>} />
              <Controller control={form.control} name={`conditions.${index}.operator`} render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{notificationRuleOperators.map((operator) => <SelectItem key={operator} value={operator}>{notificationRuleOperatorLabels[operator]}</SelectItem>)}</SelectContent></Select>} />
              <Controller control={form.control} name={`conditions.${index}.isRecurring`} render={({ field }) => (
                <Box className="items-center gap-2">
                  <Input type="checkbox" checked={field.value} onChange={(event) => field.onChange(event.target.checked)} className="size-4" />
                  <Typography variant="small">Recorrente</Typography>
                </Box>
              )} />
              <Box className="items-center gap-2"><Input {...form.register(`conditions.${index}.value`)} placeholder="AAAA-MM-DD ou data atual (context.today)" /><Button type="button" size="icon-sm" variant="ghost" aria-label="Remover condição" onClick={() => remove(index)} disabled={fields.length === 1}><Trash2Icon /></Button></Box>
            </Box>
          ))}
        </Box>

        <Box className="justify-end gap-2 border-t pt-4">
          {onCancel ? <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button> : null}
          <Button type="submit" disabled={isSubmitting}>{submitLabel}</Button>
        </Box>
      </form>
    </Box>
  )
}
