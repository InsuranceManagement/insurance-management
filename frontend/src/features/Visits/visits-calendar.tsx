"use client"

import ptBrLocale from "@fullcalendar/core/locales/pt-br"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { CalendarDaysIcon } from "lucide-react"

import { Box } from "@/shared/components/ui/box"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Typography } from "@/shared/components/ui/typography"

type VisitStatus = "Confirmada" | "Pendente" | "Concluída"

type Visit = {
  title: string
  start: string
  end: string
  status: VisitStatus
}

const statusStyles: Record<
  VisitStatus,
  { backgroundColor: string; borderColor: string }
> = {
  Confirmada: {
    backgroundColor: "#0b7fb4",
    borderColor: "#0b7fb4",
  },
  Pendente: {
    backgroundColor: "#d97706",
    borderColor: "#d97706",
  },
  Concluída: {
    backgroundColor: "#059669",
    borderColor: "#059669",
  },
}

function getLocalDateTime(daysFromToday: number, hour: number, minute = 0) {
  const date = new Date()
  date.setDate(date.getDate() + daysFromToday)
  date.setHours(hour, minute, 0, 0)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")

  return `${year}-${month}-${day}T${hours}:${minutes}:00`
}

function getVisitEvents() {
  const visits: Visit[] = [
    {
      title: "Mariana Costa · Renovação empresarial",
      start: getLocalDateTime(1, 9),
      end: getLocalDateTime(1, 10),
      status: "Confirmada",
    },
    {
      title: "Roberto Almeida · Seguro residencial",
      start: getLocalDateTime(1, 14, 30),
      end: getLocalDateTime(1, 15, 30),
      status: "Pendente",
    },
    {
      title: "Camila Nunes · Revisão de apólice",
      start: getLocalDateTime(3, 10),
      end: getLocalDateTime(3, 11),
      status: "Confirmada",
    },
    {
      title: "Grupo Horizonte · Proposta comercial",
      start: getLocalDateTime(5, 15),
      end: getLocalDateTime(5, 16, 30),
      status: "Concluída",
    },
  ]

  return visits.map((visit) => ({
    ...visit,
    ...statusStyles[visit.status],
  }))
}

const statusItems: { label: VisitStatus; className: string }[] = [
  { label: "Confirmada", className: "bg-sky-600" },
  { label: "Pendente", className: "bg-amber-600" },
  { label: "Concluída", className: "bg-emerald-600" },
]

export function VisitsCalendar() {
  const events = getVisitEvents()
  const handleCalendarClick = () => {
    window.alert("calendario clicado")
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
        <CardHeader className="gap-4 border-b">
          <Box className="flex-col gap-1">
            <CardTitle>Agenda de visitas</CardTitle>
            <CardDescription>
              Os eventos exibidos são exemplos locais e ainda não são salvos no
              sistema.
            </CardDescription>
          </Box>

          <Box className="flex-wrap items-center gap-x-4 gap-y-2">
            {statusItems.map((status) => (
              <Box key={status.label} className="items-center gap-2">
                <Box className={`size-2.5 rounded-full ${status.className}`} />
                <Typography variant="muted">{status.label}</Typography>
              </Box>
            ))}
          </Box>
        </CardHeader>

        <CardContent className="pt-6">
          <Box className="visits-calendar w-full">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              eventClick={handleCalendarClick}
              dateClick={handleCalendarClick}
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
              slotMinTime="07:00:00"
              slotMaxTime="20:00:00"
              events={events}
              eventDisplay="block"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
