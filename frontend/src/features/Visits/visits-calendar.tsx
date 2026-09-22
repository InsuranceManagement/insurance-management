"use client"

import ptBrLocale from "@fullcalendar/core/locales/pt-br"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { CalendarDaysIcon, PlusIcon } from "lucide-react"
import { useState } from "react"

import { VisitDialog } from "@/features/Visits/components/visit-dialog"
import { useVisitClients } from "@/features/Visits/hooks/use-visit-clients"
import { useVisitMutations } from "@/features/Visits/hooks/use-visit-mutations"
import { useVisits } from "@/features/Visits/hooks/use-visits"
import {
  useVisitDateRange,
  useVisitsCalendar,
} from "@/features/Visits/hooks/use-visits-calendar"
import { type VisitUpsertPayload } from "@/features/Visits/models/visit"
import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
} from "@/shared/components/ui/card"
import { Typography } from "@/shared/components/ui/typography"
import { formatDate } from "@/shared/lib/date-format"

function getLocalDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function VisitsCalendar() {
  const [selectedDate, setSelectedDate] = useState(() =>
    startOfLocalDay(new Date()),
  )
  const { data: clients = [] } = useVisitClients()
  const { dateRanges, handleDatesSet } = useVisitDateRange()
  const visitsQuery = useVisits(dateRanges)
  const calendar = useVisitsCalendar(visitsQuery.data, clients)
  const { createVisit, updateVisit, deleteVisit } = useVisitMutations()
  const selectedDateKey = getLocalDateKey(selectedDate)
  const selectedVisits = visitsQuery.data
    .filter((visit) => getLocalDateKey(new Date(visit.date)) === selectedDateKey)
    .sort((first, second) => first.date.localeCompare(second.date))
  const clientsById = new Map(clients.map((client) => [client.id, client]))

  const handleCalendarDatesSet = (info: Parameters<typeof handleDatesSet>[0]) => {
    handleDatesSet(info)

    if (info.view.type === "dayGridMonth") {
      const visibleMonth = info.view.calendar.getDate()

      setSelectedDate((currentDate) =>
        currentDate.getFullYear() === visibleMonth.getFullYear() &&
        currentDate.getMonth() === visibleMonth.getMonth()
          ? currentDate
          : new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1),
      )
    }
  }

  const handleCalendarDateClick = (
    info: Parameters<typeof calendar.handleDateClick>[0],
  ) => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setSelectedDate(startOfLocalDay(info.date))
      return
    }

    calendar.handleDateClick(info)
  }

  const handleCalendarEventClick = (
    info: Parameters<typeof calendar.handleEventClick>[0],
  ) => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      if (info.event.start) setSelectedDate(startOfLocalDay(info.event.start))
      return
    }

    calendar.handleEventClick(info)
  }

  const handleCreate = (payload: VisitUpsertPayload) => {
    createVisit.mutate({ body: payload }, { onSuccess: calendar.closeDialog })
  }

  const handleUpdate = (id: string, payload: VisitUpsertPayload) => {
    updateVisit.mutate(
      { routeParams: [id], body: payload },
      { onSuccess: calendar.closeDialog },
    )
  }

  const handleDelete = (id: string) => {
    deleteVisit.mutate(
      { routeParams: [id] },
      { onSuccess: calendar.closeDialog },
    )
  }

  return (
    <Box className="min-w-0 w-full flex-col gap-6">
      <Box className="items-start gap-3">
        <Box className="mt-1 size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <CalendarDaysIcon className="size-5" />
        </Box>
        <Box className="flex-col gap-1">
          <Typography variant="h2">Visitas</Typography>
          <Typography variant="muted">
            Acompanhe os compromissos de atendimento e as visitas aos clientes.
          </Typography>
        </Box>
      </Box>

      <Card className="min-w-0">
        <CardContent className="min-w-0 px-2 py-4 sm:px-6 sm:py-6">
          <Box className="visits-calendar min-w-0 w-full">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              datesSet={handleCalendarDatesSet}
              dateClick={handleCalendarDateClick}
              eventClick={handleCalendarEventClick}
              dayCellClassNames={(arg) =>
                getLocalDateKey(arg.date) === selectedDateKey
                  ? ["visits-selected-day"]
                  : []
              }
              dayHeaderClassNames={(arg) =>
                getLocalDateKey(arg.date) === selectedDateKey
                  ? ["visits-selected-day"]
                  : []
              }
              locale={ptBrLocale}
              initialView="dayGridMonth"
              firstDay={1}
              height="auto"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              buttonText={{
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia",
              }}
              dayHeaderContent={(arg) => {
                const weekdayInitials = ["D", "S", "T", "Q", "Q", "S", "S"]

                return (
                  <>
                    <span className="hidden md:inline">{arg.text}</span>
                    <span className="md:hidden">
                      {weekdayInitials[arg.date.getDay()]}
                    </span>
                  </>
                )
              }}
              allDaySlot={false}
              slotMinTime="07:00:00"
              slotMaxTime="19:00:00"
              events={calendar.events}
              eventDisplay="block"
              eventContent={(info) => {
                const time = info.event.start
                  ? formatDate(info.event.start, "HH:mm", "")
                  : ""

                return (
                  <div
                    className="visit-calendar-event"
                    title={info.event.title}
                  >
                    <span
                      className="visit-calendar-event-indicator"
                      aria-hidden="true"
                    />
                    <span className="sr-only">{info.event.title}</span>
                    {time ? (
                      <span className="visit-calendar-event-time">
                        {time}
                      </span>
                    ) : null}
                    <span className="visit-calendar-event-title">
                      {String(info.event.extendedProps.visitName)}
                    </span>
                  </div>
                )
              }}
            />
          </Box>

          <Box className="visit-mobile-agenda mt-4 w-full flex-col border-t pt-4 md:hidden">
            <Box className="mb-2 items-center justify-between gap-3">
              <Box className="min-w-0 flex-col gap-0.5">
                <Typography variant="large" className="capitalize">
                  {new Intl.DateTimeFormat("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  }).format(selectedDate)}
                </Typography>
                <Typography variant="muted" className="text-xs">
                  {selectedVisits.length === 1
                    ? "1 compromisso"
                    : `${selectedVisits.length} compromissos`}
                </Typography>
              </Box>
              <Button
                type="button"
                size="icon-lg"
                className="rounded-full"
                aria-label="Adicionar compromisso nesta data"
                onClick={() =>
                  calendar.openCreate(
                    new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth(),
                      selectedDate.getDate(),
                      9,
                    ),
                  )
                }
              >
                <PlusIcon className="size-5" />
              </Button>
            </Box>

            {visitsQuery.isLoading && selectedVisits.length === 0 ? (
              <Typography variant="muted" className="py-4 text-center">
                Carregando compromissos...
              </Typography>
            ) : selectedVisits.length > 0 ? (
              <Box className="w-full flex-col divide-y">
                {selectedVisits.map((visit) => {
                  const client = clientsById.get(visit.clientId)

                  return (
                    <Button
                      key={visit.id}
                      type="button"
                      variant="ghost"
                      className="h-auto w-full justify-start gap-3 rounded-md px-2 py-3 text-left whitespace-normal"
                      onClick={() => calendar.openView(visit)}
                    >
                      <span className="h-9 w-1 shrink-0 rounded-full bg-[var(--action-primary)]" />
                      <Box className="min-w-0 flex-1 flex-col gap-0.5">
                        <Typography
                          variant="small"
                          className="w-full truncate text-left"
                        >
                          {visit.name}
                        </Typography>
                        <Typography
                          variant="muted"
                          className="w-full truncate text-left text-xs"
                        >
                          {client?.name ?? visit.description}
                        </Typography>
                      </Box>
                      <Typography variant="muted" className="shrink-0 text-xs">
                        {formatDate(visit.date, "HH:mm", "")}
                      </Typography>
                    </Button>
                  )
                })}
              </Box>
            ) : (
              <Typography variant="muted" className="py-4 text-center">
                Nenhum compromisso nesta data.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      <VisitDialog
        state={calendar.dialogState}
        clients={clients}
        isCreating={createVisit.isPending}
        isUpdating={updateVisit.isPending}
        isDeleting={deleteVisit.isPending}
        onClose={calendar.closeDialog}
        onEdit={calendar.openEdit}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </Box>
  )
}
