import { type ReactElement } from "react"

import {
  BarChart,
  type BarChartProps,
} from "@/shared/components/Charts/bar-chart"
import {
  LineChart,
  type LineChartProps,
} from "@/shared/components/Charts/line-chart"
import {
  PieChart,
  type PieChartProps,
} from "@/shared/components/Charts/pie-chart"

export type ChartRendererConfig =
  | ({ id: string; type: "line" } & LineChartProps)
  | ({ id: string; type: "bar" } & BarChartProps)
  | ({ id: string; type: "pie" } & PieChartProps)
  | ({ id: string; type: "donut" } & PieChartProps)

const chartRendererByType: {
  line: (chart: Extract<ChartRendererConfig, { type: "line" }>) => ReactElement
  bar: (chart: Extract<ChartRendererConfig, { type: "bar" }>) => ReactElement
  pie: (chart: Extract<ChartRendererConfig, { type: "pie" }>) => ReactElement
  donut: (
    chart: Extract<ChartRendererConfig, { type: "donut" }>,
  ) => ReactElement
} = {
  line: (chart) => (
    <LineChart
      key={chart.id}
      data={chart.data}
      title={chart.title}
      subtitle={chart.subtitle}
      xAxisTitle={chart.xAxisTitle}
      yAxisTitle={chart.yAxisTitle}
      xAxisType={chart.xAxisType}
      showLegend={chart.showLegend}
    />
  ),
  bar: (chart) => (
    <BarChart
      key={chart.id}
      data={chart.data}
      title={chart.title}
      subtitle={chart.subtitle}
      xAxisTitle={chart.xAxisTitle}
      yAxisTitle={chart.yAxisTitle}
      showLegend={chart.showLegend}
    />
  ),
  pie: (chart) => (
    <PieChart
      key={chart.id}
      data={chart.data}
      title={chart.title}
      subtitle={chart.subtitle}
      showLegend={chart.showLegend}
    />
  ),
  donut: (chart) => (
    <PieChart
      key={chart.id}
      data={chart.data}
      title={chart.title}
      subtitle={chart.subtitle}
      showLegend={chart.showLegend}
      donut
    />
  ),
}

export function renderChartByType(chart: ChartRendererConfig): ReactElement {
  if (chart.type === "line") {
    return chartRendererByType.line(chart)
  }

  if (chart.type === "bar") {
    return chartRendererByType.bar(chart)
  }

  if (chart.type === "pie") {
    return chartRendererByType.pie(chart)
  }

  return chartRendererByType.donut(chart)
}
