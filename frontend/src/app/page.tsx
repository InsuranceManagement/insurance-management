import { ChartCard } from "@/shared/components/ChartCard/chart-card"
import { BarChart } from "@/shared/components/Charts/bar-chart"
import { Box } from "@/shared/components/ui/box"
import { Typography } from "@/shared/components/ui/typography"
import { type ChartSeries } from "@/shared/models/charts/chart-series"
import { ChartTypeSizePreset } from "@/shared/models/charts/chart-size-preset"

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

export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <section className="grid auto-rows-min gap-4 md:grid-cols-3">
        <article className="rounded-xl border bg-card p-4">
          <Typography variant="muted">Apolices ativas</Typography>
          <Typography variant="large" className="mt-3 text-3xl">
            1.284
          </Typography>
        </article>
        <article className="rounded-xl border bg-card p-4">
          <Typography variant="muted">Sinistros do mes</Typography>
          <Typography variant="large" className="mt-3 text-3xl">
            37
          </Typography>
        </article>
        <article className="rounded-xl border bg-card p-4">
          <Typography variant="muted">Premio emitido</Typography>
          <Typography variant="large" className="mt-3 text-3xl">
            R$ 2,8 mi
          </Typography>
        </article>
      </section>

      <section className="grid auto-rows-min gap-4 xl:grid-cols-4">
        <ChartCard
          preset={ChartTypeSizePreset.TWO_BY_ONE}
          contentClassName="flex h-full flex-col"
        >
          <BarChart
            data={mockClientsByCompany}
            title="Clientes por seguradora"
            subtitle="Base mockada para validar visualizacao"
            xAxisTitle="Quantidade de clientes"
            yAxisTitle="Seguradoras"
            orientation="column"
            showLegend={false}
            height="100%"
          />
        </ChartCard>
      </section>

      <section className="min-h-80 rounded-xl border bg-card p-5">
        <Typography variant="h4" className="text-xl">
          Fila de analise
        </Typography>
        <Typography variant="muted" className="mt-2">
          Acompanhe propostas pendentes, revisoes e tarefas operacionais da
          equipe.
        </Typography>

        <Box className="mt-5 grid gap-3">
          <Box className="items-center justify-between rounded-lg bg-muted px-4 py-3">
            <Typography asChild variant="small">
              <span>Proposta #A-2026-1044</span>
            </Typography>
            <Typography asChild variant="muted">
              <span>Em revisao</span>
            </Typography>
          </Box>
          <Box className="items-center justify-between rounded-lg bg-muted px-4 py-3">
            <Typography asChild variant="small">
              <span>Sinistro #CLM-7781</span>
            </Typography>
            <Typography asChild variant="muted">
              <span>Aguardando documentos</span>
            </Typography>
          </Box>
          <Box className="items-center justify-between rounded-lg bg-muted px-4 py-3">
            <Typography asChild variant="small">
              <span>Renovacao #RNW-2219</span>
            </Typography>
            <Typography asChild variant="muted">
              <span>Pronta para emissao</span>
            </Typography>
          </Box>
        </Box>
      </section>
    </main>
  )
}
