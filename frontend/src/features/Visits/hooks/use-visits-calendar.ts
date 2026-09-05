import { type DatesSetArg, type EventClickArg } from "@fullcalendar/core"
import { type DateClickArg } from "@fullcalendar/interaction"
import { useMemo, useState } from "react"

import { type Client } from "@/features/ClientCrud/models/client"
import { formatDate } from "@/shared/lib/date-format"
import { type Visit, type VisitDateRange } from "../models/visit"

export type VisitDialogState =
  | { mode: "create"; date: string }
  | { mode: "edit"; visit: Visit }
  | null

export type CalendarVisibleRange = {
  start: Date
  end: Date
}

function createMonthDateRange(date: Date): VisitDateRange {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1)

  return {
    startDate: start.toISOString(),
    endDate: new Date(end.getTime() - 1).toISOString(),
  }
}

function createVisibleMonthRanges(start: Date, end: Date): VisitDateRange[] {
  const ranges: VisitDateRange[] = []
  const lastVisibleDate = new Date(end.getTime() - 1)
  const month = new Date(start.getFullYear(), start.getMonth(), 1)
  const lastMonth = new Date(
    lastVisibleDate.getFullYear(),
    lastVisibleDate.getMonth(),
    1,
  )

  while (month <= lastMonth) {
    ranges.push(createMonthDateRange(month))
    month.setMonth(month.getMonth() + 1)
  }

  return ranges
}

function hasSameDateRanges(
  currentRanges: VisitDateRange[],
  nextRanges: VisitDateRange[],
) {
  return (
    currentRanges.length === nextRanges.length &&
    currentRanges.every(
      (range, index) =>
        range.startDate === nextRanges[index].startDate &&
        range.endDate === nextRanges[index].endDate,
    )
  )
}

function localDateTime(date: Date) {
  return formatDate(date, "YYYY-MM-DDTHH:mm", "")
}

function formatSlotTime(hour: number) {
  return `${String(hour).padStart(2, "0")}:00:00`
}

export function useVisitDateRange() {
  const [dateRanges, setDateRanges] = useState<VisitDateRange[]>(() => [
    createMonthDateRange(new Date()),
  ])
  const [visibleRange, setVisibleRange] = useState<CalendarVisibleRange>(() => {
    const date = new Date()
    return {
      start: new Date(date.getFullYear(), date.getMonth(), 1),
      end: new Date(date.getFullYear(), date.getMonth() + 1, 1),
    }
  })

  const handleDatesSet = (info: DatesSetArg) => {
    const nextDateRanges =
      info.view.type === "dayGridMonth"
        ? [createMonthDateRange(info.view.calendar.getDate())]
        : createVisibleMonthRanges(info.start, info.end)

    setVisibleRange({ start: info.start, end: info.end })

    setDateRanges((currentDateRanges) =>
      hasSameDateRanges(currentDateRanges, nextDateRanges)
        ? currentDateRanges
        : nextDateRanges,
    )
  }

  return { dateRanges, visibleRange, handleDatesSet }
}

export function useVisitsCalendar(
  visits: Visit[],
  clients: Client[],
  visibleRange: CalendarVisibleRange,
) {
  const [dialogState, setDialogState] = useState<VisitDialogState>(null)

  const events = useMemo(() => {
    const clientsById = new Map(clients.map((client) => [client.id, client.name]))

    return visits.map((visit) => ({
      id: visit.id,
      title: clientsById.get(visit.clientId)
        ? `${visit.name} · ${clientsById.get(visit.clientId)}`
        : visit.name,
      start: visit.date,
    }))
  }, [clients, visits])

  const slotRange = useMemo(() => {
    let earliestHour = 7
    let latestHour = 20

    for (const visit of visits) {
      const visitDate = new Date(visit.date)

      if (visitDate < visibleRange.start || visitDate >= visibleRange.end) {
        continue
      }

      const visitHour = new Date(visit.date).getHours()
      earliestHour = Math.min(earliestHour, visitHour)
      latestHour = Math.max(latestHour, Math.min(visitHour + 1, 24))
    }

    return {
      minTime: formatSlotTime(earliestHour),
      maxTime: formatSlotTime(latestHour),
    }
  }, [visits, visibleRange])

  const handleDateClick = (info: DateClickArg) => {
    setDialogState({
      mode: "create",
      date: localDateTime(info.date),
    })
  }

  const handleEventClick = (info: EventClickArg) => {
    const visit = visits.find((item) => item.id === info.event.id)
    if (visit) setDialogState({ mode: "edit", visit })
  }

  return {
    dialogState,
    events,
    slotRange,
    handleDateClick,
    handleEventClick,
    closeDialog: () => setDialogState(null),
  }
}
