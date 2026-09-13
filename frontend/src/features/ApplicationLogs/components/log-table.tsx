import { ArrowUpRightIcon, MessageSquareTextIcon } from "lucide-react"

import { LogStatus } from "@/features/ApplicationLogs/components/log-status"
import {
  getTypeLabel,
  type NotificationLog,
} from "@/features/ApplicationLogs/models/notification-log"
import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { Typography } from "@/shared/components/ui/typography"
import { formatDate } from "@/shared/lib/date-format"

type LogTableProps = {
  logs: NotificationLog[]
  onSelect: (log: NotificationLog) => void
}

export function LogTable({ logs, onSelect }: Readonly<LogTableProps>) {
  return (
    <Table className="min-w-[760px] table-fixed">
      <caption className="sr-only">
        Histórico de mensagens, dos registros mais recentes aos mais antigos
      </caption>
      <TableHeader className="bg-muted/40">
        <TableRow className="hover:bg-transparent">
          <TableHead scope="col" className="w-[38%] pl-6 text-xs text-muted-foreground">
            TIPO / DESTINATÁRIO
          </TableHead>
          <TableHead scope="col" className="w-[18%] text-xs text-muted-foreground">
            STATUS
          </TableHead>
          <TableHead scope="col" className="w-[17%] text-xs text-muted-foreground">
            REMETENTE
          </TableHead>
          <TableHead scope="col" className="w-[18%] text-xs text-muted-foreground">
            DATA E HORA
          </TableHead>
          <TableHead scope="col" className="w-[9%]">
            <span className="sr-only">Detalhes</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id} className="group">
            <TableCell className="py-5 pl-6">
              <Box className="items-center gap-3">
                <Box className="size-10 shrink-0 items-center justify-center rounded-xl border bg-background text-muted-foreground group-hover:text-primary">
                  <MessageSquareTextIcon aria-hidden="true" className="size-4" />
                </Box>
                <Box className="min-w-0 flex-col gap-1">
                  <Typography variant="small" className="truncate">
                    {getTypeLabel(log)}
                  </Typography>
                  <Typography variant="muted" className="truncate">
                    {log.recipient || "Destinatário não informado"}
                  </Typography>
                </Box>
              </Box>
            </TableCell>
            <TableCell>
              <LogStatus log={log} />
            </TableCell>
            <TableCell>
              <Typography variant="muted" className="truncate">
                {log.sentBy || "Sistema"}
              </Typography>
            </TableCell>
            <TableCell>
              <Box className="flex-col gap-1">
                <Typography variant="small" className="tabular-nums">
                  {formatDate(log.timestamp, "DD/MM/YYYY")}
                </Typography>
                <Typography variant="muted" className="text-xs tabular-nums">
                  {formatDate(log.timestamp, "HH:mm:ss")}
                </Typography>
              </Box>
            </TableCell>
            <TableCell className="pr-4 text-right">
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Ver detalhes da mensagem para ${log.recipient || "destinatário não informado"}`}
                onClick={() => onSelect(log)}
              >
                <ArrowUpRightIcon />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
