"use client"

import { useState } from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  LayersIcon,
  LogsIcon,
  MessageSquareTextIcon,
  RefreshCwIcon,
  SearchIcon,
} from "lucide-react"

import { LogDetails } from "@/features/ApplicationLogs/components/log-details"
import { LogTable } from "@/features/ApplicationLogs/components/log-table"
import { useApplicationLogs } from "@/features/ApplicationLogs/hooks/use-application-logs"
import { type NotificationLog } from "@/features/ApplicationLogs/models/notification-log"
import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { SelectInput } from "@/shared/components/ui/select-input"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Typography } from "@/shared/components/ui/typography"
import { formatDate } from "@/shared/lib/date-format"
import { cn } from "@/shared/lib/utils"

// SelectInput reserves the empty string for its placeholder.
const ALL = "__all_logs__"

export function ApplicationLogs() {
  const logs = useApplicationLogs()
  const [selectedLog, setSelectedLog] = useState<NotificationLog | null>(null)
  const { query } = logs
  const hasData = query.data !== undefined
  const stats = [
    {
      label: "Mensagens registradas",
      value: logs.total,
      icon: MessageSquareTextIcon,
      caption: "Todo o histórico disponível",
    },
    {
      label: "Registros com erro",
      value: logs.errorCount,
      icon: CircleAlertIcon,
      caption: "Mensagens com erro informado",
    },
    {
      label: "Tipos de mensagem",
      value: logs.types.length,
      icon: LayersIcon,
      caption: "Presentes neste histórico",
    },
  ]

  return (
    <Box
      asChild
      className="min-w-0 flex-1 flex-col gap-6 bg-muted/20 p-4 sm:p-6 lg:p-8"
    >
      <main>
        <Box className="flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <Box className="flex-col gap-2">
            <Typography
              variant="small"
              className="flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase"
            >
              <LogsIcon aria-hidden="true" className="size-4" /> Histórico de
              mensagens
            </Typography>
            <Typography asChild variant="h2">
              <h1>Registros de mensagens</h1>
            </Typography>
            <Typography variant="muted">
              Acompanhe as mensagens da aplicação e consulte os detalhes de cada
              registro.
            </Typography>
          </Box>
          <Button
            variant="outline"
            className="h-10 w-full self-start sm:w-auto sm:self-center"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            <RefreshCwIcon className={cn(query.isFetching && "animate-spin")} />
            {query.isFetching ? "Atualizando…" : "Atualizar"}
          </Button>
        </Box>

        <Box className="grid gap-3 md:grid-cols-3">
          {stats.map((stat) => (
            <Box
              key={stat.label}
              className="flex-col gap-4 rounded-2xl border bg-card p-5 shadow-xs"
            >
              <Box className="items-center justify-between gap-3">
                <Typography variant="small" className="text-muted-foreground">
                  {stat.label}
                </Typography>
                <stat.icon
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
              </Box>
              <Box className="flex-col gap-1">
                <Typography variant="h2" asChild className="tabular-nums">
                  <p>{hasData ? stat.value.toLocaleString("pt-BR") : "—"}</p>
                </Typography>
                <Typography variant="muted" className="text-xs">
                  {stat.caption}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {query.isError && (
          <Box
            role="alert"
            className="items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/5 p-4"
          >
            <CircleAlertIcon
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-destructive"
            />
            <Box className="flex-col gap-1">
              <Typography variant="small">
                {hasData
                  ? "Não foi possível atualizar os logs."
                  : "Não foi possível carregar os logs."}
              </Typography>
              <Typography variant="muted">
                {hasData
                  ? "Os dados da última consulta continuam visíveis. Use Atualizar para tentar novamente."
                  : "Tente novamente pelo botão Atualizar. Se o problema continuar, verifique a disponibilidade do serviço de mensagens."}
              </Typography>
            </Box>
          </Box>
        )}

        <Box
          className="min-w-0 flex-col overflow-hidden rounded-2xl border bg-card shadow-xs"
          aria-busy={query.isFetching}
        >
          <Box className="flex-col gap-5 border-b p-5 md:p-6">
            <Box className="flex-wrap items-center justify-between gap-2">
              <Typography variant="h4">Registros de mensagens</Typography>
              <Typography variant="muted" className="text-xs">
                Mais recentes primeiro
              </Typography>
            </Box>
            <Box className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
              <Box className="min-w-0 flex-col gap-2">
                <Label htmlFor="log-search">Buscar mensagem</Label>
                <Box className="relative">
                  <SearchIcon
                    aria-hidden="true"
                    className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground"
                  />
                  <Input
                    id="log-search"
                    type="search"
                    placeholder="Destinatário, conteúdo ou remetente…"
                    className="pl-9"
                    value={logs.filters.search}
                    onChange={(event) =>
                      logs.updateFilters({ search: event.target.value })
                    }
                  />
                </Box>
              </Box>
              <Box className="min-w-0 flex-col gap-2 [&>button]:w-full">
                <Label htmlFor="log-status">Status</Label>
                <SelectInput
                  id="log-status"
                  value={logs.filters.status || ALL}
                  onChange={(value) =>
                    logs.updateFilters({ status: value === ALL ? "" : value })
                  }
                  options={[
                    { value: ALL, label: "Todos os status" },
                    ...logs.statuses,
                  ]}
                />
              </Box>
              <Box className="min-w-0 flex-col gap-2 [&>button]:w-full">
                <Label htmlFor="log-type">Tipo de mensagem</Label>
                <SelectInput
                  id="log-type"
                  value={logs.filters.type || ALL}
                  onChange={(value) =>
                    logs.updateFilters({ type: value === ALL ? "" : value })
                  }
                  options={[
                    { value: ALL, label: "Todos os tipos" },
                    ...logs.types,
                  ]}
                />
              </Box>
            </Box>
            <Box className="flex-wrap items-center justify-between gap-3">
              <Box className="flex-wrap items-center gap-2">
                <Button
                  variant={logs.filters.errorsOnly ? "destructive" : "outline"}
                  size="sm"
                  className="rounded-full"
                  aria-pressed={logs.filters.errorsOnly}
                  onClick={() =>
                    logs.updateFilters({ errorsOnly: !logs.filters.errorsOnly })
                  }
                >
                  <CircleAlertIcon /> Somente com erro
                </Button>
                {logs.hasFilters && (
                  <Button variant="ghost" size="sm" onClick={logs.clearFilters}>
                    Limpar filtros
                  </Button>
                )}
              </Box>
              <Typography
                variant="muted"
                className="text-xs"
                aria-live="polite"
              >
                {hasData
                  ? `${logs.filteredCount.toLocaleString("pt-BR")} de ${logs.total.toLocaleString("pt-BR")} registros`
                  : "Aguardando consulta"}
              </Typography>
            </Box>
          </Box>

          {query.isPending && (
            <Box role="status" className="flex-col gap-5 p-6">
              <span className="sr-only">Carregando registros de mensagens</span>
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton key={index} className="h-14 w-full rounded-lg" />
              ))}
            </Box>
          )}

          {hasData && logs.visibleLogs.length > 0 && (
            <LogTable logs={logs.visibleLogs} onSelect={setSelectedLog} />
          )}

          {hasData && logs.visibleLogs.length === 0 && (
            <Box
              role="status"
              className="items-center gap-3 px-6 py-16 text-center flex-col"
            >
              <Box className="mb-1 size-14 items-center justify-center rounded-2xl bg-muted">
                <SearchIcon
                  aria-hidden="true"
                  className="size-6 text-muted-foreground"
                />
              </Box>
              <Typography variant="large">
                {logs.hasFilters
                  ? "Nenhuma mensagem encontrada"
                  : "Nenhuma mensagem registrada"}
              </Typography>
              <Typography variant="muted">
                {logs.hasFilters
                  ? "Tente outros termos ou limpe os filtros para ver o histórico."
                  : "Os registros aparecerão aqui quando estiverem disponíveis."}
              </Typography>
              {logs.hasFilters && (
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={logs.clearFilters}
                >
                  Limpar filtros
                </Button>
              )}
            </Box>
          )}

          {hasData && logs.filteredCount > 0 && (
            <Box className="flex-col items-stretch gap-3 border-t px-5 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <Typography variant="muted" className="text-xs">
                Exibindo {logs.startIndex + 1}–
                {logs.startIndex + logs.visibleLogs.length} de{" "}
                {logs.filteredCount}
              </Typography>
              <Box className="items-center justify-between gap-3 sm:justify-start">
                <Typography variant="muted" className="text-xs">
                  Página {logs.currentPage} de {logs.pageCount}
                </Typography>
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Página anterior"
                  disabled={logs.currentPage === 1}
                  onClick={() => logs.setPage(logs.currentPage - 1)}
                >
                  <ChevronLeftIcon />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Próxima página"
                  disabled={logs.currentPage === logs.pageCount}
                  onClick={() => logs.setPage(logs.currentPage + 1)}
                >
                  <ChevronRightIcon />
                </Button>
              </Box>
            </Box>
          )}
        </Box>
        {query.dataUpdatedAt > 0 && (
          <Typography variant="muted" className="text-xs">
            Última atualização:{" "}
            {formatDate(
              new Date(query.dataUpdatedAt),
              "DD/MM/YYYY [às] HH:mm:ss",
            )}
          </Typography>
        )}
        <LogDetails log={selectedLog} onClose={() => setSelectedLog(null)} />
      </main>
    </Box>
  )
}
