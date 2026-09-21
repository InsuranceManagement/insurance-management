import { Dashboard } from "@/features/Dashboard/dashboard"

export default function Home() {
  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <Dashboard />
    </main>
  )
}
