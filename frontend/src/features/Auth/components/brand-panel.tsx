export function BrandPanel() {
  return (
    <div
      className="relative hidden overflow-hidden lg:flex items-center justify-center p-12 text-white"
      style={{
        background:
          "linear-gradient(135deg, #03314a 0%, #06608a 50%, #138ec7 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.20), transparent 35%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15), transparent 45%)
          `,
        }}
      />

      <div className="relative z-10 max-w-xl text-center">
        <h1 className="text-6xl font-bold tracking-tight">Bem-vindo</h1>

        <h2 className="mt-4 text-xl font-medium text-white/90">
          Sistema de Gestão para Corretora de Seguros
        </h2>

        <p className="mt-6 text-base leading-relaxed text-white/80">
          Acesse sua área administrativa para gerenciar clientes, seguradoras,
          gráficos e acompanhar toda a operação da corretora de forma simples e
          organizada.
        </p>
      </div>
    </div>
  )
}
