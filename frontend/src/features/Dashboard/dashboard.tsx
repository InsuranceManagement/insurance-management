import { BarChart } from "@/shared/components/Charts/bar-chart"
import { KPIChart } from "@/shared/components/Charts/kpi"
import { LineChart } from "@/shared/components/Charts/line-chart"
import { PieChart } from "@/shared/components/Charts/pie-chart"
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
    name: "Clientes",
    type: "bar",
    color: "#3B82F6",
    unit: "clientes",
    data: [
      { name: "Porto", y: 1280 },
      { name: "SulAmerica", y: 1134 },
      { name: "Bradesco", y: 1028 },
      { name: "Tokio Marine", y: 842 },
      { name: "Allianz", y: 795 },
      { name: "MAPFRE", y: 674 },
    ],
  },
]

const mockEmploymentGrowthByArea: ChartSeries[] = [
  {
    name: "Instalacao e Desenvolvimento",
    type: "line",
    color: "#2EA8FF",
    unit: "mil",
    data: [
      { name: "2018", y: 84 },
      { name: "2019", y: 92 },
      { name: "2020", y: 105 },
      { name: "2021", y: 121 },
      { name: "2022", y: 133 },
      { name: "2023", y: 142 },
      { name: "2024", y: 158 },
    ],
  },
  {
    name: "Manufacturing",
    type: "line",
    color: "#22C55E",
    unit: "mil",
    data: [
      { name: "2018", y: 18 },
      { name: "2019", y: 19 },
      { name: "2020", y: 20 },
      { name: "2021", y: 23 },
      { name: "2022", y: 24 },
      { name: "2023", y: 25 },
      { name: "2024", y: 27 },
    ],
  },
  {
    name: "Vendas e Distribuicao",
    type: "line",
    color: "#EAB308",
    unit: "mil",
    data: [
      { name: "2018", y: 12 },
      { name: "2019", y: 14 },
      { name: "2020", y: 15 },
      { name: "2021", y: 16 },
      { name: "2022", y: 18 },
      { name: "2023", y: 20 },
      { name: "2024", y: 22 },
    ],
  },
]

const mockPoliciesByType: ChartSeries[] = [
  {
    name: "Apolices",
    type: "pie",
    unit: "apolices",
    data: [
      { name: "Auto", y: 520 },
      { name: "Residencial", y: 310 },
      { name: "Vida", y: 220 },
      { name: "Empresarial", y: 180 },
      { name: "Saude", y: 140 },
    ],
  },
]

const mockInsurancePremiumByAge: ChartSeries[] = [
  {
    name: "Plano Basico",
    type: "line",
    color: "#2563EB",
    unit: "R$",
    data: [
      { x: 25, name: "25 anos", y: 220 },
      { x: 30, name: "30 anos", y: 255 },
      { x: 35, name: "35 anos", y: 292 },
      { x: 45, name: "45 anos", y: 388 },
      { x: 60, name: "60 anos", y: 575 },
    ],
  },
  {
    name: "Plano Completo",
    type: "line",
    color: "#DC2626",
    unit: "R$",
    data: [
      { x: 25, name: "25 anos", y: 340 },
      { x: 30, name: "30 anos", y: 392 },
      { x: 35, name: "35 anos", y: 448 },
      { x: 45, name: "45 anos", y: 612 },
      { x: 60, name: "60 anos", y: 890 },
    ],
  },
]

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

      <PieChart
        data={mockPoliciesByType}
        title="Distribuicao por tipo"
        subtitle="Mock para validacao de chart 4x4"
        showLegend
        donut
      />

      <LineChart
        data={mockInsurancePremiumByAge}
        title="Premio de seguro por idade"
        subtitle="Exemplo com x continuo: idade do cliente"
        xAxisTitle="Idade (anos)"
        yAxisTitle="Premio (R$)"
        xAxisType="linear"
        showLegend
      />
    </section>
  )
}
