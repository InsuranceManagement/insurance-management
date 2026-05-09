export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <section className="grid auto-rows-min gap-4 md:grid-cols-3">
        <article className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Apolices ativas</p>
          <p className="mt-3 text-3xl font-semibold">1.284</p>
        </article>
        <article className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Sinistros do mes</p>
          <p className="mt-3 text-3xl font-semibold">37</p>
        </article>
        <article className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Premio emitido</p>
          <p className="mt-3 text-3xl font-semibold">R$ 2,8 mi</p>
        </article>
      </section>

      <section className="min-h-80 rounded-xl border bg-card p-5">
        <h1 className="text-xl font-semibold">Fila de analise</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Acompanhe propostas pendentes, revisoes e tarefas operacionais da
          equipe.
        </p>

        <div className="mt-5 grid gap-3">
          <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
            <span className="text-sm">Proposta #A-2026-1044</span>
            <span className="text-sm text-muted-foreground">Em revisao</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
            <span className="text-sm">Sinistro #CLM-7781</span>
            <span className="text-sm text-muted-foreground">
              Aguardando documentos
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
            <span className="text-sm">Renovacao #RNW-2219</span>
            <span className="text-sm text-muted-foreground">
              Pronta para emissao
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}
