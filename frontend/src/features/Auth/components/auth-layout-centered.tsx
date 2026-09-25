import { Box } from "@/shared/components/ui/box"

interface AuthLayoutCenteredProps {
  children: React.ReactNode
}

export function AuthLayoutCentered({ children }: AuthLayoutCenteredProps) {
  return (
    <Box className="min-h-dvh items-center justify-center bg-[linear-gradient(135deg,#044766_0%,#06608a_50%,#0b7fb4_100%)] px-5 py-4 sm:p-6">
      {children}
    </Box>
  )
}
