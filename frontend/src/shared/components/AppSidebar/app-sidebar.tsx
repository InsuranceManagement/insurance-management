"use client"

import {
  CircleDollarSignIcon,
  CalendarDaysIcon,
  BellIcon,
  HomeIcon,
  LogsIcon,
  LogOutIcon,
  MailIcon,
  PackageIcon,
  TagsIcon,
  UsersIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useMemo } from "react"

import logoBranca from "@/shared/assets/logo_branca.png"
import logoWm from "@/shared/assets/logo_wm.png"
import { useAuth } from "@/shared/context/auth-context"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/shared/components/ui/sidebar"
import { Typography } from "@/shared/components/ui/typography"

const mainItems = [
  {
    title: "Visão geral",
    href: "/dashboard",
    icon: HomeIcon,
  },
]

const supportItems = [
  {
    title: "Registros de mensagens",
    href: "/logs",
    icon: LogsIcon,
  },
  {
    title: "Regras de mensagem",
    href: "/notificacoes",
    icon: BellIcon,
  },
  {
    title: "Templates de mensagem",
    href: "/notificacoes/templates",
    icon: MailIcon,
  },
  {
    title: "Visitas",
    href: "/visitas",
    icon: CalendarDaysIcon,
  },
  {
    title: "Seguradoras",
    href: "/seguradoras",
    icon: CircleDollarSignIcon,
  },
  {
    title: "Produtos",
    href: "/produtos",
    icon: PackageIcon,
  },
  {
    title: "Tipos de produto",
    href: "/tipos-de-produto",
    icon: TagsIcon,
  },
  {
    title: "Clientes",
    href: "/clientes",
    icon: UsersIcon,
  },
]

const navItems = [...mainItems, ...supportItems]

// Entre itens cujo href é prefixo de outro (ex.: "/notificacoes" e
// "/notificacoes/templates"), só o mais especifico deve ficar marcado
// como ativo.
function getActiveHref(pathname: string | null): string | null {
  const matches = navItems.filter(
    (item) => pathname === item.href || pathname?.startsWith(`${item.href}/`),
  )

  if (matches.length === 0) return null

  return matches.reduce((longest, item) =>
    item.href.length > longest.href.length ? item : longest,
  ).href
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const activeHref = useMemo(() => getActiveHref(pathname), [pathname])
  const { isMobile, setOpenMobile } = useSidebar()

  const { logout } = useAuth()

  const handleNavigate = () => {
    if (isMobile) setOpenMobile(false)
  }

  const handleLogout = () => {
    handleNavigate()
    logout()
    router.replace("/login")
  }

  return (
    <Sidebar
      collapsible="icon"
      className="border-none"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="Mainiere"
              className="h-24 hover:bg-transparent! active:bg-transparent! data-open:hover:bg-transparent! group-data-[collapsible=icon]:justify-center"
            >
              <Link href="/dashboard" onClick={handleNavigate}>
                <Image
                  src={logoBranca}
                  alt="Mainiere"
                  priority
                  className="w-48 max-w-none shrink-0 group-data-[collapsible=icon]:hidden"
                />
                <Image
                  src={logoWm}
                  alt="Mainiere"
                  priority
                  className="hidden w-24 max-w-none shrink-0 group-data-[collapsible=icon]:block"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/90">
            Principal
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="text-sidebar-foreground"
                    isActive={item.href === activeHref}
                  >
                    <Link href={item.href} onClick={handleNavigate}>
                      <item.icon />

                      <Typography
                        asChild
                        variant="small"
                        className="text-sidebar-foreground"
                      >
                        <span>{item.title}</span>
                      </Typography>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/90">
            Operação
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="text-sidebar-foreground"
                    isActive={item.href === activeHref}
                  >
                    <Link href={item.href} onClick={handleNavigate}>
                      <item.icon />

                      <Typography
                        asChild
                        variant="small"
                        className="text-sidebar-foreground"
                      >
                        <span>{item.title}</span>
                      </Typography>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sair"
              onClick={handleLogout}
              className="text-sidebar-foreground"
            >
              <LogOutIcon />

              <Typography
                asChild
                variant="small"
                className="text-sidebar-foreground"
              >
                <span>Sair</span>
              </Typography>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
