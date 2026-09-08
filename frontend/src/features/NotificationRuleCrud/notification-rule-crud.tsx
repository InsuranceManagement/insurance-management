"use client"

import { useMemo } from "react"

import { NotificationRuleForm } from "@/features/NotificationRuleCrud/components/form"
import {
  notificationRuleGroups,
  notificationRuleFieldLabels,
  notificationRuleGroupLabels,
  type NotificationRule,
  type NotificationTemplate,
  type NotificationRuleUpsertPayload,
} from "@/features/NotificationRuleCrud/models/notification-rule"
import {
  type CrudCardView,
} from "@/shared/components/CrudScreen/components/crud-card-list"
import { CrudScreen } from "@/shared/components/CrudScreen/crud-screen"
import { type EntityViewField } from "@/shared/components/CrudScreen/components/EntityViewModal"
import { Box } from "@/shared/components/ui/box"
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Typography } from "@/shared/components/ui/typography"
import { routes } from "@/shared/constants/routes"
import { useApiQuery } from "@/shared/hooks/use-api-query"
import { formatDate } from "@/shared/lib/date-format"

const viewFields: EntityViewField<NotificationRule>[] = [
  { accessorKey: "templateId", label: "Template" },
  {
    accessorKey: "isActive",
    label: "Status",
    cell: ({ entity }) => (
      <Typography variant="small">
        {entity.isActive ? "Ativa" : "Inativa"}
      </Typography>
    ),
  },
  {
    accessorKey: "condition",
    label: "Condição",
    cell: ({ entity }) => (
      <Box asChild>
        <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">
          {JSON.stringify(entity.condition, null, 2)}
        </pre>
      </Box>
    ),
  },
]

function formatConditionValue(value: unknown): string {
  if (value === "context.today") return "Data atual"
  return typeof value === "string" ? value : JSON.stringify(value)
}

function createCardView(
  templates: NotificationTemplate[],
): CrudCardView<NotificationRule> {
  const templateNames = new Map(
    templates.map((template) => [template.id, template.name]),
  )

  return {
    searchPlaceholder: "Buscar por regra ou template...",
    getSearchText: (rule) =>
      [
        rule.name,
        rule.templateId,
        templateNames.get(rule.templateId),
        rule.isActive ? "ativa" : "inativa",
      ]
        .filter(Boolean)
        .join(" "),
    renderCard: ({ entity: rule }) => {
      const conditionGroups = notificationRuleGroups
        .map((group) => ({
          group,
          conditions: rule.condition[group] ?? [],
        }))
        .filter(({ conditions }) => conditions.length)

      return (
        <>
          <CardHeader className="pr-12">
            <CardTitle>{rule.name}</CardTitle>
            <CardDescription>
              {templateNames.get(rule.templateId) ?? rule.templateId}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Box className="flex-col gap-4">
              <Box className="items-center justify-between gap-3">
                <Typography variant="small" className="text-muted-foreground">
                  Status
                </Typography>
                <Typography
                  variant="small"
                  className={
                    rule.isActive
                      ? "rounded-full bg-primary/10 px-2 py-1 text-primary"
                      : "rounded-full bg-muted px-2 py-1 text-muted-foreground"
                  }
                >
                  {rule.isActive ? "Ativa" : "Inativa"}
                </Typography>
              </Box>

              <Box className="flex-col gap-2">
                <Typography variant="small" className="text-muted-foreground">
                  Condições
                </Typography>
                {conditionGroups.length ? (
                  <Box className="flex-col gap-1.5">
                    {conditionGroups.map(({ group, conditions }) => (
                      <Box key={group} className="flex-col gap-1">
                        <Typography variant="small" className="font-medium">
                          {notificationRuleGroupLabels[group]}
                        </Typography>
                        {conditions.map((condition, index) => (
                          <Box
                            key={`${condition.field}-${index}`}
                            className="flex-wrap gap-x-1 rounded-md bg-muted px-2 py-1.5 text-xs"
                          >
                            <Typography variant="small">
                              {notificationRuleFieldLabels[condition.field]} = {formatConditionValue(condition.value)}
                              {condition.isRecurring ? " (recorrente)" : ""}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="small" className="text-muted-foreground">
                    Sem condições configuradas.
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>

          <CardFooter className="border-t">
            <Typography variant="small" className="text-muted-foreground">
              Atualizada em {formatDate(rule.updatedAt, "DD/MM/YYYY HH:mm")}
            </Typography>
          </CardFooter>
        </>
      )
    },
  }
}

export default function NotificationRuleCrud() {
  const { data: templates = [] } = useApiQuery<NotificationTemplate[]>({
    route: routes.notifications.templates,
    queryKey: ["notification-templates"],
    meta: { errorMessage: "Erro ao carregar templates." },
  })
  const cardView = useMemo(() => createCardView(templates), [templates])

  return (
    <CrudScreen<NotificationRule, NotificationRuleUpsertPayload>
      title="Regras de mensagem"
      cardView={cardView}
      createForm={NotificationRuleForm}
      createFormTitle="Nova regra"
      editFormTitle="Editar regra"
      formModalContentClassName="sm:max-w-2xl"
      viewFields={viewFields}
      viewModalTitle="Detalhes da regra"
      mapEditEntityToFormValues={(rule) => ({
        name: rule.name,
        templateId: rule.templateId,
        condition: rule.condition,
        isActive: rule.isActive,
      })}
      sourceRoutes={{
        list: routes.notificationRules.list,
        create: routes.notificationRules.create,
        edit: routes.notificationRules.updateById,
        delete: routes.notificationRules.deleteMany,
      }}
    />
  )
}
