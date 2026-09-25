import { CircleAlertIcon } from "lucide-react"

import { Box } from "@/shared/components/ui/box"
import { Modal } from "@/shared/components/ui/modal"
import { Typography } from "@/shared/components/ui/typography"
import { type NotificationLog } from "@/features/ApplicationLogs/models/notification-log"

type LogDetailsProps = {
  log: NotificationLog | null
  onClose: () => void
}

function buildEmailPreview(body: string) {
  if (/<html[\s>]/i.test(body)) return body

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; font-src data:; base-uri 'none'; form-action 'none'" />
    <style>
      :root { color-scheme: light; }
      body { margin: 0; padding: 24px; color: #111827; background: #ffffff; font-family: Arial, sans-serif; line-height: 1.5; }
      img { max-width: 100%; height: auto; }
      a { color: #1d4ed8; }
    </style>
  </head>
  <body>${body}</body>
</html>`
}

export function LogDetails({ log, onClose }: Readonly<LogDetailsProps>) {
  if (!log) return null

  return (
    <Modal
      title="Visualização da mensagem"
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      contentClassName="sm:max-w-3xl"
      mobileFullscreen
    >
      <Box className="w-full min-w-0 flex-col gap-4">
        <Typography variant="muted">
          Pré-visualização do e-mail como ele foi enviado.
        </Typography>
        <iframe
          title="Pré-visualização do conteúdo do e-mail"
          sandbox=""
          referrerPolicy="no-referrer"
          srcDoc={buildEmailPreview(log.body)}
          className="h-[min(62dvh,640px)] w-full rounded-xl border bg-white"
        />
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
      </Box>
    </Modal>
  )
}
