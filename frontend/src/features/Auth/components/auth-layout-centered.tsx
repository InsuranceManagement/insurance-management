import { Box } from "@/shared/components/ui/box"

interface AuthLayoutCenteredProps {
  children: React.ReactNode
}

export function AuthLayoutCentered({ children }: AuthLayoutCenteredProps) {
  return (
    <Box className="flex min-h-screen items-center justify-center p-6 bg-[linear-gradient(135deg,#044766_0%,#06608a_50%,#0b7fb4_100%)]">
      {children}
    </Box>
  )
}
