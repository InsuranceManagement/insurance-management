"use client"

import { useDashboard } from "@/features/Dashboard/hooks/use-dashboard"
import { KPIChart } from "@/shared/components/Charts/kpi"
import { renderChartByType } from "@/shared/lib/chart-renderer"

export const Dashboard = () => {
  const { charts, kpis } = useDashboard()
  console.log(kpis)
  return (
    <section className="relative grid grid-cols-8 auto-rows-[6rem] gap-4">
      {kpis.map((kpi) => (
        <KPIChart
          key={kpi.id}
          title={kpi.title}
          valueUrl={kpi.valueUrl}
          prefix={kpi.prefix}
          unit={kpi.unit}
        />
      ))}

      {charts.map((chart) => renderChartByType(chart))}
    </section>
  )
}
