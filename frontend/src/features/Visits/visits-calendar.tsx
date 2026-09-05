"use client"

import ptBrLocale from "@fullcalendar/core/locales/pt-br"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { CalendarDaysIcon } from "lucide-react"

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Typography } from "@/shared/components/ui/typography"

export function VisitsCalendar() {
  const { data: clients = [] } = useVisitClients()
  const { dateRanges, visibleRange, handleDatesSet } = useVisitDateRange()
  const visitsQuery = useVisits(dateRanges)
  const calendar = useVisitsCalendar(visitsQuery.data, clients, visibleRange)
  const { createVisit, updateVisit, deleteVisit } = useVisitMutations()

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
    <Box className="w-full flex-col gap-6">
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

      <Card>
        <CardHeader className="gap-1 border-b">
          <CardTitle>Agenda de visitas</CardTitle>
          <CardDescription>
            Clique em uma data para criar uma visita ou em um evento para editar
            e excluir.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Box className="visits-calendar w-full">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              datesSet={handleDatesSet}
              dateClick={calendar.handleDateClick}
              eventClick={calendar.handleEventClick}
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
              allDaySlot={false}
              slotMinTime={calendar.slotRange.minTime}
              slotMaxTime={calendar.slotRange.maxTime}
              events={calendar.events}
              eventDisplay="block"
            />
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
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </Box>
  )
}
