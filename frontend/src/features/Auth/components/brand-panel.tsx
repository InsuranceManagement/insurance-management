import { Box } from "@/shared/components/ui/box"
import { Typography } from "@/shared/components/ui/typography"

export function BrandPanel() {
  return (
    <Box
      className="relative hidden overflow-hidden items-center justify-center p-12 text-white lg:flex"
      style={{
        background:
          "linear-gradient(135deg, #03314a 0%, #06608a 50%, #138ec7 100%)",
      }}
    >
      <Box
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.20), transparent 35%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15), transparent 45%)
          `,
        }}
      />

      <Box className="relative z-10 max-w-xl text-center flex-col">
        <Typography
          asChild
          className="text-6xl font-bold tracking-tight text-white"
        >
          <h1>Bem-vindo</h1>
        </Typography>

        <Typography
          asChild
          className="mt-4 text-xl font-medium text-white/90"
        >
          <h2>Sistema de Gestão para Corretora de Seguros</h2>
        </Typography>

        <Typography
          asChild
          className="mt-6 text-base leading-relaxed text-white/80"
        >
          <p>
            Acesse sua área administrativa para gerenciar clientes, seguradoras,
            gráficos e acompanhar toda a operação da corretora de forma simples
            e organizada.
          </p>
        </Typography>
      </Box>
    </Box>
  )
}
