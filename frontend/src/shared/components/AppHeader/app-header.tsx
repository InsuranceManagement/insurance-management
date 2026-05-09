"use client"

import { BellIcon, MoonIcon, SearchIcon, SunIcon } from "lucide-react"

import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
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
          Ola, Roberto Mendes!
        </Typography>

        <Box className="relative hidden w-full max-w-sm md:block">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-9 bg-card pl-8"
            placeholder="Pesquisar apolices, clientes..."
            aria-label="Pesquisar apolices"
          />
        </Box>

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

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="rounded-full bg-card text-xs font-semibold"
          aria-label="Perfil do usuario"
        >
          <Typography asChild variant="small" className="text-xs font-semibold">
            <span>RM</span>
          </Typography>
        </Button>
      </Box>
    </header>
  )
}
