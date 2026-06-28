"use client"

import { BellIcon, MoonIcon, SunIcon } from "lucide-react"

import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { Typography } from "@/shared/components/ui/typography"
import { useTheme } from "@/shared/hooks/use-theme"

export function AppHeader() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="border-b bg-background">
      <Box className="h-14 items-center gap-3 px-4 md:px-6">
        <SidebarTrigger className="-ml-1" />

        <Typography
          variant="large"
          className="min-w-0 flex-1 truncate text-base md:text-3xl"
        >
          Olá, Wladmir Mainiere!
        </Typography>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
          onClick={toggleTheme}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          className="relative"
          aria-label="Notificacoes"
        >
          <BellIcon />
          <Typography
            asChild
            variant="small"
            className="absolute -top-1 -right-1 inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground"
          >
            <span>3</span>
          </Typography>
        </Button>
      </Box>
    </header>
  )
}
