"use client"

import { useState } from "react"

import { type NotificationRule } from "@/features/NotificationRuleCrud/models/notification-rule"
import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Typography } from "@/shared/components/ui/typography"
import { routes } from "@/shared/constants/routes"
import { useApiMutation } from "@/shared/hooks/use-api-mutation"

type NotificationRulePreviewResult = {
  total: number
  clients: { id: string; name: string; email: string }[]
}

type NotificationRulePreviewProps = {
  rule: NotificationRule
}

export function NotificationRulePreview({
  rule,
}: Readonly<NotificationRulePreviewProps>) {
  const [result, setResult] = useState<NotificationRulePreviewResult | null>(
    null,
  )

  const previewMutation = useApiMutation<NotificationRulePreviewResult>({
    route: routes.notificationRules.previewById,
    meta: { errorMessage: "Erro ao testar a regra." },
  })

  const handlePreview = () => {
    previewMutation.mutate(
      { routeParams: [rule.id] },
      { onSuccess: (data) => setResult(data) },
    )
  }

  const remaining = result ? result.total - result.clients.length : 0

  return (
    <Box className="flex-col gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={handlePreview}
        disabled={previewMutation.isPending}
      >
        {previewMutation.isPending ? "Testando..." : "Testar regra"}
      </Button>

      {result ? (
        <Box className="flex-col gap-1.5 rounded-md border p-3">
          <Typography variant="small" className="font-medium">
            {result.total} cliente(s) seriam notificados hoje
          </Typography>

          {result.clients.length ? (
            <Box className="flex-col gap-1">
              {result.clients.map((client) => (
                <Typography
                  key={client.id}
                  variant="small"
                  className="text-muted-foreground"
                >
                  {client.name} — {client.email}
                </Typography>
              ))}
              {remaining > 0 ? (
                <Typography variant="small" className="text-muted-foreground">
                  +{remaining} outros
                </Typography>
              ) : null}
            </Box>
          ) : (
            <Typography variant="small" className="text-muted-foreground">
              Nenhum cliente seria notificado hoje.
            </Typography>
          )}
        </Box>
      ) : null}
    </Box>
  )
}
