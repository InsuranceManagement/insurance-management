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
      <Box className="h-14 min-w-0 items-center gap-2 px-3 sm:gap-3 sm:px-4 lg:px-6">
        <SidebarTrigger className="-ml-1 size-10 lg:size-8" />

        <Typography
          variant="large"
          className="min-w-0 flex-1 truncate text-base sm:text-lg lg:text-3xl"
        >
          Olá, Wladmir Mainiere!
        </Typography>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-10 lg:size-8"
          aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
          onClick={toggleTheme}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          className="relative size-10 lg:size-8"
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
