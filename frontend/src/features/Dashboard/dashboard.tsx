import { BarChart } from "@/shared/components/Charts/bar-chart"
import { KPIChart } from "@/shared/components/Charts/kpi"
import { LineChart } from "@/shared/components/Charts/line-chart"
import { type ChartSeries } from "@/shared/models/charts/chart-series"

type MockKPI = {
  id: string
  title: string
  subtitle: string
  value: number
  unit?: string
  prefix?: string
}

const mockKpis: MockKPI[] = [
  {
    id: "kpi-active-clients",
    title: "Clientes ativos",
    subtitle: "Carteira total",
    value: 4321,
  },
  {
    id: "kpi-active-policies",
    title: "Apolices ativas",
    subtitle: "Base vigente",
    value: 1284,
  },
  {
    id: "kpi-average-ticket",
    title: "Ticket medio",
    subtitle: "Premio por cliente",
    prefix: "R$ ",
    value: 648.42,
  },
  {
    id: "kpi-conversion-rate",
    title: "Taxa de conversao",
    subtitle: "Leads convertidos",
    value: 37.8,
    unit: "%",
  },
]

const mockClientsByCompany: ChartSeries[] = [
  {
    id: "clients-by-company",
    name: "Clientes",
    type: "bar",
    color: "#3B82F6",
    unit: "clientes",
    points: [
      { x: "Porto", y: 1280 },
      { x: "SulAmerica", y: 1134 },
      { x: "Bradesco", y: 1028 },
      { x: "Tokio Marine", y: 842 },
      { x: "Allianz", y: 795 },
      { x: "MAPFRE", y: 674 },
    ],
  },
]

const mockEmploymentGrowthByArea: ChartSeries[] = [
  {
    id: "series-installation",
    name: "Instalacao e Desenvolvimento",
    type: "line",
    color: "#2EA8FF",
    unit: "mil",
    points: [
      { x: "2018", y: 84 },
      { x: "2019", y: 92 },
      { x: "2020", y: 105 },
      { x: "2021", y: 121 },
      { x: "2022", y: 133 },
      { x: "2023", y: 142 },
      { x: "2024", y: 158 },
    ],
  },
  {
    id: "series-manufacturing",
    name: "Manufacturing",
    type: "line",
    color: "#22C55E",
    unit: "mil",
    points: [
      { x: "2018", y: 18 },
      { x: "2019", y: 19 },
      { x: "2020", y: 20 },
      { x: "2021", y: 23 },
      { x: "2022", y: 24 },
      { x: "2023", y: 25 },
      { x: "2024", y: 27 },
    ],
  },
  {
    id: "series-sales",
    name: "Vendas e Distribuicao",
    type: "line",
    color: "#EAB308",
    unit: "mil",
    points: [
      { x: "2018", y: 12 },
      { x: "2019", y: 14 },
      { x: "2020", y: 15 },
      { x: "2021", y: 16 },
      { x: "2022", y: 18 },
      { x: "2023", y: 20 },
      { x: "2024", y: 22 },
    ],
  },
]

const mockEmptyLineChart: ChartSeries[] = []

export const Dashboard = () => {
  return (
    <section className="relative grid grid-cols-8 auto-rows-[6rem] gap-4">
      {mockKpis.map((kpi) => (
        <KPIChart
          key={kpi.id}
          title={kpi.title}
          value={kpi.value}
          prefix={kpi.prefix}
          unit={kpi.unit}
        />
      ))}

      <LineChart
        data={mockEmploymentGrowthByArea}
        title="Evolucao por area"
        subtitle="Mock para validacao de chart 4x4"
        xAxisTitle="Ano"
        yAxisTitle="Volume (mil)"
        showLegend
      />

      <BarChart
        data={mockClientsByCompany}
        title="Clientes por seguradora"
        subtitle="Base mockada para validar visualizacao"
        xAxisTitle="Quantidade de clientes"
        yAxisTitle="Seguradoras"
        orientation="column"
        showLegend={false}
      />

      <LineChart
        data={mockEmptyLineChart}
        title="Evolucao mensal"
        subtitle="Grafico propositalmente vazio"
        xAxisTitle="Mes"
        yAxisTitle="Volume"
        showLegend
      />
    </section>
  )
}
