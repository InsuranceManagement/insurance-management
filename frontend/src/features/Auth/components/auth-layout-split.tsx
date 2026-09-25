import { BrandPanel } from "@/features/Auth/components/brand-panel"
import { Box } from "@/shared/components/ui/box"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayoutSplit({ children }: AuthLayoutProps) {
  return (
    <Box className="grid min-h-dvh lg:grid-cols-2">
      <BrandPanel />

      <Box className="min-w-0 items-center justify-center bg-background px-5 py-4 sm:p-6 lg:p-12">
        {children}
      </Box>
    </Box>
  )
}
