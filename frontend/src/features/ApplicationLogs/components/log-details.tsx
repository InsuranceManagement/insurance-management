import { CircleAlertIcon } from "lucide-react"

import { LogStatus } from "@/features/ApplicationLogs/components/log-status"
import {
  getTypeLabel,
  type NotificationLog,
} from "@/features/ApplicationLogs/models/notification-log"
import { Box } from "@/shared/components/ui/box"
import { Modal } from "@/shared/components/ui/modal"
import { Typography } from "@/shared/components/ui/typography"
import { formatDate } from "@/shared/lib/date-format"

type LogDetailsProps = {
  log: NotificationLog | null
  onClose: () => void
}

export function LogDetails({ log, onClose }: Readonly<LogDetailsProps>) {
  if (!log) return null

  const fields = [
    { label: "Destinatário", value: log.recipient },
    { label: "Enviado por", value: log.sentBy },
    { label: "Tipo de mensagem", value: getTypeLabel(log) },
    {
      label: "Data e hora",
      value: formatDate(log.timestamp, "DD/MM/YYYY [às] HH:mm:ss"),
    },
  ]

  return (
    <Modal
      title="Detalhes da mensagem"
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      contentClassName="sm:max-w-2xl"
    >
      <Box className="max-h-[70dvh] w-full min-w-0 flex-col gap-6 overflow-y-auto pr-1">
        <Box className="items-center justify-between gap-3">
          <Typography variant="muted">Registro de mensagem</Typography>
          <LogStatus log={log} />
        </Box>
        <Box asChild className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <dl>
            {fields.map((field) => (
              <Box key={field.label} className="min-w-0 flex-col gap-1">
                <Typography asChild variant="muted">
                  <dt>{field.label}</dt>
                </Typography>
                <Typography asChild variant="small" className="break-words">
                  <dd>{field.value || "Não informado"}</dd>
                </Typography>
              </Box>
            ))}
          </dl>
        </Box>
        {log.errorMessage && (
          <Box className="flex-col gap-2 rounded-xl border border-destructive/25 bg-destructive/5 p-4">
            <Box className="items-center gap-2">
              <CircleAlertIcon aria-hidden="true" className="size-4 text-destructive" />
              <Typography variant="small">Erro registrado</Typography>
            </Box>
            <Typography className="text-sm leading-6 whitespace-pre-wrap break-words">
              {log.errorMessage}
            </Typography>
          </Box>
        )}
        <Box className="flex-col gap-1 border-t pt-4">
          <Typography variant="muted">Identificador do registro</Typography>
          <Typography variant="small" className="font-mono text-xs break-all">
            {log.id}
          </Typography>
        </Box>
      </Box>
    </Modal>
  )
}
