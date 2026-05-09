import { Box } from "@/shared/components/ui/box"
import { Typography } from "@/shared/components/ui/typography"

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
