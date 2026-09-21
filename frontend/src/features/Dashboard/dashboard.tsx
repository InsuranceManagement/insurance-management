"use client"

import { useMemo, useState, type FormEvent } from "react"

import { useDashboard } from "@/features/Dashboard/hooks/use-dashboard"
import { KPIChart } from "@/shared/components/Charts/kpi"
import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Typography } from "@/shared/components/ui/typography"
import { renderChartByType } from "@/shared/lib/chart-renderer"

type DashboardDateRange = {
  startDate: string
  endDate: string
}

function toLocalDateTime(date: string, endOfDay: boolean): string {
  const time = endOfDay ? "23:59:59.999" : "00:00:00.000"
  const localDate = new Date(`${date}T${time}`)
  const offsetMinutes = -localDate.getTimezoneOffset()
  const offsetSign = offsetMinutes >= 0 ? "+" : "-"
  const absoluteOffset = Math.abs(offsetMinutes)
  const offsetHours = String(Math.floor(absoluteOffset / 60)).padStart(2, "0")
  const offsetRemainder = String(absoluteOffset % 60).padStart(2, "0")

  return `${date}T${time}${offsetSign}${offsetHours}:${offsetRemainder}`
}

export const Dashboard = () => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [dateError, setDateError] = useState("")
  const [appliedRange, setAppliedRange] = useState<DashboardDateRange>()
  const queryRange = useMemo(
    () =>
      appliedRange
        ? {
            startDate: toLocalDateTime(appliedRange.startDate, false),
            endDate: toLocalDateTime(appliedRange.endDate, true),
          }
        : undefined,
    [appliedRange],
  )
  const { charts, kpis } = useDashboard(queryRange)

  const handleApply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!startDate && !endDate) {
      setDateError("")
      setAppliedRange(undefined)
      return
    }

    if (!startDate || !endDate) {
      setDateError("Preencha a data inicial e a data final para aplicar o filtro.")
      return
    }

    if (startDate > endDate) {
      setDateError("A data inicial deve ser anterior ou igual à data final.")
      return
    }

    setDateError("")
    setAppliedRange({ startDate, endDate })
  }

  const handleClear = () => {
    setStartDate("")
    setEndDate("")
    setDateError("")
    setAppliedRange(undefined)
  }

  return (
    <Box className="min-w-0 w-full flex-col gap-4">
      <form
        className="grid min-w-0 gap-4 rounded-xl border bg-card p-4 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:items-end"
        onSubmit={handleApply}
        noValidate
      >
        <Box className="flex-col gap-1">
          <Typography variant="large">Período</Typography>
          <Typography variant="muted" className="text-xs">
            Sem datas, são exibidos todos os registros.
          </Typography>
        </Box>

        <Box className="grid min-w-0 flex-1 gap-3 sm:max-w-xl sm:grid-cols-2">
          <Box className="min-w-0 flex-col gap-2">
            <Label htmlFor="dashboard-start-date">Data inicial</Label>
            <Input
              id="dashboard-start-date"
              type="date"
              value={startDate}
              aria-invalid={Boolean(dateError)}
              aria-describedby={dateError ? "dashboard-date-error" : undefined}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </Box>
          <Box className="min-w-0 flex-col gap-2">
            <Label htmlFor="dashboard-end-date">Data final</Label>
            <Input
              id="dashboard-end-date"
              type="date"
              value={endDate}
              aria-invalid={Boolean(dateError)}
              aria-describedby={dateError ? "dashboard-date-error" : undefined}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </Box>
        </Box>

        <Box className="flex-col gap-2 sm:flex-row sm:flex-wrap xl:justify-end [&>button]:w-full sm:[&>button]:w-auto">
          <Button type="submit">Aplicar</Button>
          <Button type="button" variant="outline" onClick={handleClear}>
            Limpar
          </Button>
        </Box>

        {dateError && (
          <Typography
            id="dashboard-date-error"
            role="alert"
            variant="small"
            className="text-destructive xl:col-span-3"
          >
            {dateError}
          </Typography>
        )}
      </form>

      <section className="relative grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-8 xl:auto-rows-[6rem]">
        {kpis.map((kpi) => (
          <KPIChart
            key={kpi.id}
            title={kpi.title}
            valueUrl={kpi.valueUrl}
            queryParams={kpi.queryParams}
            prefix={kpi.prefix}
            unit={kpi.unit}
          />
        ))}

        {charts.map((chart) => renderChartByType(chart))}
      </section>
    </Box>
  )
}
