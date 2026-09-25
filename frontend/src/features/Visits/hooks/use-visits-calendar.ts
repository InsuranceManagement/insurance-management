import { type DatesSetArg, type EventClickArg } from "@fullcalendar/core"
import { type DateClickArg } from "@fullcalendar/interaction"
import { useMemo, useState } from "react"

import { type Client } from "@/features/ClientCrud/models/client"
import { formatDate } from "@/shared/lib/date-format"
import { type Visit, type VisitDateRange } from "../models/visit"

export type VisitDialogState =
  | { mode: "create"; date: string }
  | { mode: "view"; visit: Visit }
  | { mode: "edit"; visit: Visit }
  | null

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

export function useVisitDateRange() {
  const [dateRanges, setDateRanges] = useState<VisitDateRange[]>(() => [
    createMonthDateRange(new Date()),
  ])

  const handleDatesSet = (info: DatesSetArg) => {
    const nextDateRanges =
      info.view.type === "dayGridMonth"
        ? [createMonthDateRange(info.view.calendar.getDate())]
        : createVisibleMonthRanges(info.start, info.end)

    setDateRanges((currentDateRanges) =>
      hasSameDateRanges(currentDateRanges, nextDateRanges)
        ? currentDateRanges
        : nextDateRanges,
    )
  }

  return { dateRanges, handleDatesSet }
}

export function useVisitsCalendar(
  visits: Visit[],
  clients: Client[],
) {
  const [dialogState, setDialogState] = useState<VisitDialogState>(null)

  const events = useMemo(() => {
    const clientsById = new Map(clients.map((client) => [client.id, client]))

    return visits.map((visit) => {
      const client = clientsById.get(visit.clientId)

      return {
        id: visit.id,
        title: client ? `${visit.name} · ${client.name}` : visit.name,
        start: visit.date,
        extendedProps: { visitName: visit.name },
      }
    })
  }, [clients, visits])

  const handleDateClick = (info: DateClickArg) => {
    openCreate(info.date)
  }

  const handleEventClick = (info: EventClickArg) => {
    const visit = visits.find((item) => item.id === info.event.id)
    if (visit) setDialogState({ mode: "view", visit })
  }

  const openEdit = (visit: Visit) => {
    setDialogState({ mode: "edit", visit })
  }

  const openCreate = (date: Date) => {
    setDialogState({ mode: "create", date: localDateTime(date) })
  }

  const openView = (visit: Visit) => {
    setDialogState({ mode: "view", visit })
  }

  return {
    dialogState,
    events,
    handleDateClick,
    handleEventClick,
    openCreate,
    openView,
    openEdit,
    closeDialog: () => setDialogState(null),
  }
}
