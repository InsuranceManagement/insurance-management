import { Dashboard } from "@/features/Dashboard/dashboard"

export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <Dashboard />
    </main>
  )
}
