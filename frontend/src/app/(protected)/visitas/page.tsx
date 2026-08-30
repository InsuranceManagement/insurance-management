import { VisitsCalendar } from "@/features/Visits/visits-calendar"

export default function VisitsPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <VisitsCalendar />
    </main>
  )
}
