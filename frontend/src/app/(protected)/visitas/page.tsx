import { VisitsCalendar } from "@/features/Visits/visits-calendar"

export default function VisitsPage() {
  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 px-5 py-4 sm:p-6 lg:p-8">
      <VisitsCalendar />
    </main>
  )
}
